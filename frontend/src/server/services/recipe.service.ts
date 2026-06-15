import {
  IRecipeRepository,
  SpoonacularRecipeRepository,
  SupabaseRecipeRepository,
} from '../repository/recipe.repository';
import { resolveDataSource, DataSource } from '../utils/data-source.util';
import type {
  RecipeSearchResult,
  RecipeByIngredientItem,
  RecipeDetail,
} from '../types/recipe.types';

// ─── Repository factory (lazy singleton per data source) ─────────────────────
const repositoryCache = new Map<DataSource, IRecipeRepository>();

function getRepository(source?: string): IRecipeRepository {
  const dataSource = resolveDataSource(source);
  if (!repositoryCache.has(dataSource)) {
    const repo =
      dataSource === 'supabase'
        ? new SupabaseRecipeRepository()
        : new SpoonacularRecipeRepository();
    repositoryCache.set(dataSource, repo);
  }
  return repositoryCache.get(dataSource)!;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class RecipeService {
  async searchRecipes(
    query: string,
    cuisine: string,
    source?: string,
  ): Promise<RecipeSearchResult> {
    return getRepository(source).searchRecipes(query, cuisine);
  }

  async searchRecipesByIngredients(
    ingredients: string,
    source?: string,
  ): Promise<RecipeByIngredientItem[]> {
    const list = ingredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    return getRepository(source).searchRecipesByIngredients(list);
  }

  async getRecipeById(id: string, source?: string): Promise<RecipeDetail> {
    return getRepository(source).getRecipeById(id);
  }
}
