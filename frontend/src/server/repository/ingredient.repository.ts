import { IIngredient } from '../models/ingredient.model';

// ─── Shared mock data ─────────────────────────────────────────────────────────
const MOCK_POPULAR_INGREDIENTS: IIngredient[] = [
  {
    id: 1123,
    name: 'egg',
    image: 'https://spoonacular.com/cdn/ingredients_100x100/egg.png',
  },
  {
    id: 5006,
    name: 'chicken',
    image: 'https://spoonacular.com/cdn/ingredients_100x100/whole-chicken.jpg',
  },
  {
    id: 11529,
    name: 'tomato',
    image: 'https://spoonacular.com/cdn/ingredients_100x100/tomato.png',
  },
  {
    id: 11215,
    name: 'garlic',
    image: 'https://spoonacular.com/cdn/ingredients_100x100/garlic.png',
  },
  {
    id: 11282,
    name: 'onion',
    image: 'https://spoonacular.com/cdn/ingredients_100x100/brown-onion.png',
  },
];

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IIngredientRepository {
  searchIngredients(keyword: string): Promise<IIngredient[]>;
  getPopularIngredients(): Promise<IIngredient[]>;
}

// ─── 1. Spoonacular API ───────────────────────────────────────────────────────

import axios from 'axios';
import { ENV } from '../config/env';
import { supabase } from '../config/supabase';
import { SPOONACULAR_INGREDIENT_CDN } from '../constants';

export class SpoonacularIngredientRepository
  implements IIngredientRepository
{
  async searchIngredients(keyword: string): Promise<IIngredient[]> {
    if (!keyword || keyword.trim().length === 0) return [];

    const response = await axios.get(
      `${ENV.SPOONACULAR_BASE_URL}/food/ingredients/autocomplete`,
      {
        params: { query: keyword.trim(), number: 10, metaInformation: true },
        headers: { 'x-api-key': ENV.SPOONACULAR_API_KEY },
      },
    );

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.image ? `${SPOONACULAR_INGREDIENT_CDN}/${item.image}` : '',
    }));
  }

  async getPopularIngredients(): Promise<IIngredient[]> {
    return MOCK_POPULAR_INGREDIENTS;
  }
}

// ─── 2. Supabase DB ───────────────────────────────────────────────────────────

export class SupabaseIngredientRepository implements IIngredientRepository {
  async searchIngredients(keyword: string): Promise<IIngredient[]> {
    if (!keyword || keyword.trim().length === 0) return [];

    const { data, error } = await supabase
      .from('ingredients')
      .select('id, name, image')
      .ilike('name', `%${keyword.trim()}%`)
      .limit(10);

    if (error) throw new Error(`Supabase Database Error: ${error.message}`);

    return (data ?? []).map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.image || '',
    }));
  }

  async getPopularIngredients(): Promise<IIngredient[]> {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name, image')
        .limit(5);

      if (error) throw error;

      if (!data || data.length === 0) {
        return MOCK_POPULAR_INGREDIENTS;
      }

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image || '',
      }));
    } catch (error: any) {
      console.error(
        '🔴 Supabase getPopularIngredients error, fallback to mock:',
        error.message,
      );
      return MOCK_POPULAR_INGREDIENTS;
    }
  }
}
