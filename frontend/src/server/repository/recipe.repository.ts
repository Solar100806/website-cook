import axios from 'axios';
import { ENV } from '../config/env';
import { supabase } from '../config/supabase';
import { normalizeRecipeDetail } from '../utils/recipe.mapper';
import { normalizeImageUrl } from '../utils/image.util';
import {
  DEFAULT_RESULT_LIMIT,
  FALLBACK_RECIPE_NAME,
  FALLBACK_INGREDIENT_NAME,
  SPOONACULAR_INGREDIENT_CDN,
} from '../constants';
import type {
  RecipeSearchResult,
  RecipeByIngredientItem,
  RecipeDetail,
  ExtendedIngredient,
} from '../types/recipe.types';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IRecipeRepository {
  searchRecipes(query: string, cuisine: string): Promise<RecipeSearchResult>;
  searchRecipesByIngredients(
    ingredients: string[],
  ): Promise<RecipeByIngredientItem[]>;
  getRecipeById(id: string): Promise<RecipeDetail>;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function assertSupabaseResult(error: any): void {
  if (error) throw new Error(`Supabase Database Error: ${error.message}`);
}

function mapJoinedIngredient(ri: any): ExtendedIngredient {
  return {
    id: ri.ingredients?.id ?? 0,
    name: ri.ingredients?.name ?? FALLBACK_INGREDIENT_NAME,
    amount: ri.quantity ?? '',
    unit: ri.unit ?? '',
    image: ri.ingredients?.image
      ? `${SPOONACULAR_INGREDIENT_CDN}/${ri.ingredients.image}`
      : '',
  };
}

// ─── 1. Spoonacular API ───────────────────────────────────────────────────────

export class SpoonacularRecipeRepository implements IRecipeRepository {
  async searchRecipes(
    query: string,
    cuisine: string,
  ): Promise<RecipeSearchResult> {
    const response = await axios.get(
      `${ENV.SPOONACULAR_BASE_URL}/recipes/complexSearch`,
      {
        params: { query, cuisine, number: DEFAULT_RESULT_LIMIT },
        headers: { 'x-api-key': ENV.SPOONACULAR_API_KEY },
      },
    );
    return response.data;
  }

  async searchRecipesByIngredients(
    ingredients: string[],
  ): Promise<RecipeByIngredientItem[]> {
    const response = await axios.get(
      `${ENV.SPOONACULAR_BASE_URL}/recipes/findByIngredients`,
      {
        params: {
          ingredients: ingredients.join(','),
          number: DEFAULT_RESULT_LIMIT,
          ranking: 1,
        },
        headers: { 'x-api-key': ENV.SPOONACULAR_API_KEY },
      },
    );
    return response.data;
  }

  async getRecipeById(id: string): Promise<RecipeDetail> {
    const response = await axios.get(
      `${ENV.SPOONACULAR_BASE_URL}/recipes/${id}/information`,
      { headers: { 'x-api-key': ENV.SPOONACULAR_API_KEY } },
    );
    return normalizeRecipeDetail(response.data);
  }
}

// ─── 2. Supabase DB ───────────────────────────────────────────────────────────

export class SupabaseRecipeRepository implements IRecipeRepository {
  async searchRecipes(
    query: string,
    cuisine: string,
  ): Promise<RecipeSearchResult> {
    let dbQuery = supabase
      .from('recipes')
      .select(
        'id, title, name, image, image_url, description, cook_time, difficulty, cuisine',
      );

    if (query.trim()) {
      const term = `%${query.trim()}%`;
      dbQuery = dbQuery.or(
        `title.ilike.${term},name.ilike.${term},description.ilike.${term}`,
      );
    }

    if (cuisine.trim()) {
      dbQuery = dbQuery.ilike('cuisine', `%${cuisine.trim()}%`);
    }

    const { data, error } = await dbQuery.limit(DEFAULT_RESULT_LIMIT);
    assertSupabaseResult(error);

    const results = (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title || r.name || FALLBACK_RECIPE_NAME,
      image: r.image || r.image_url || '',
      description: r.description || '',
      cook_time: r.cook_time || '',
      difficulty: r.difficulty || '',
      cuisine: r.cuisine || '',
    }));

    return { results };
  }

  async searchRecipesByIngredients(
    ingredients: string[],
  ): Promise<RecipeByIngredientItem[]> {
    const { data: recipes, error } = await supabase.from('recipes').select(`
        id, title, name, image, image_url, description, cook_time, difficulty, cuisine,
        recipe_ingredients (
          id, quantity, unit,
          ingredients ( id, name, image )
        )
      `);

    assertSupabaseResult(error);
    if (!recipes || recipes.length === 0) return [];

    const normalizedSearch = ingredients
      .map((i) => i.toLowerCase().trim())
      .filter(Boolean);

    const matched = recipes.map((recipe: any) => {
      const recipeIngredients: any[] = recipe.recipe_ingredients ?? [];
      const used: ExtendedIngredient[] = [];
      const missed: ExtendedIngredient[] = [];

      recipeIngredients.forEach((ri: any) => {
        if (!ri.ingredients) return;
        const normName = (ri.ingredients.name ?? '').toLowerCase().trim();
        const isMatched = normalizedSearch.some(
          (s) => normName.includes(s) || s.includes(normName),
        );
        (isMatched ? used : missed).push(mapJoinedIngredient(ri));
      });

      return {
        id: recipe.id,
        title: recipe.title || recipe.name || FALLBACK_RECIPE_NAME,
        name: recipe.name || recipe.title || FALLBACK_RECIPE_NAME,
        image: recipe.image || recipe.image_url || '',
        description: recipe.description || '',
        cook_time: recipe.cook_time || '',
        difficulty: recipe.difficulty || '',
        usedIngredientCount: used.length,
        missedIngredientCount: missed.length,
        usedIngredients: used,
        missedIngredients: missed,
        unusedIngredients: [],
        extendedIngredients: recipeIngredients.map(mapJoinedIngredient),
      };
    });

    return matched
      .filter((r: any) => r.usedIngredientCount > 0)
      .sort(
        (a: any, b: any) =>
          b.usedIngredientCount - a.usedIngredientCount ||
          a.missedIngredientCount - b.missedIngredientCount,
      )
      .slice(0, DEFAULT_RESULT_LIMIT);
  }

  async getRecipeById(id: string): Promise<RecipeDetail> {
    const isUuid = isNaN(Number(id));

    let queryBuilder = supabase.from('recipes').select(`
      id, title, name, description, image, image_url, cook_time, difficulty, cuisine,
      recipe_ingredients (
        id, quantity, unit,
        ingredients ( id, name, image )
      ),
      recipe_steps ( id, step_order, content, image, image_url )
    `);

    queryBuilder = isUuid
      ? queryBuilder.eq('id', id)
      : queryBuilder.eq('id', Number(id));

    const { data: recipe, error } = await queryBuilder.maybeSingle();
    assertSupabaseResult(error);

    if (!recipe) {
      throw new Error(`Món ăn với ID ${id} không tìm thấy trên hệ thống.`);
    }

    const extendedIngredients: ExtendedIngredient[] = (
      recipe.recipe_ingredients ?? []
    ).map(mapJoinedIngredient);

    const recipeImage = normalizeImageUrl(
      recipe.image ?? recipe.image_url,
      recipe.image ?? recipe.image_url ?? '',
    );

    const steps = (recipe.recipe_steps ?? [])
      .sort((a: any, b: any) => a.step_order - b.step_order)
      .map((s: any) => ({
        number: s.step_order,
        step: s.content,
        step_order: s.step_order,
        content: s.content,
        image: normalizeImageUrl(s.image ?? s.image_url, recipeImage),
      }));

    return {
      id: recipe.id,
      title: recipe.title || recipe.name || FALLBACK_RECIPE_NAME,
      name: recipe.name || recipe.title || FALLBACK_RECIPE_NAME,
      description: recipe.description || '',
      image: recipeImage,
      image_url: recipeImage,
      cook_time: recipe.cook_time || '',
      difficulty: recipe.difficulty || '',
      extendedIngredients,
      analyzedInstructions: [{ name: '', steps }],
      steps,
    };
  }
}
