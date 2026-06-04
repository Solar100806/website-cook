import { IIngredient } from '../models/ingredient.model';
import {
  IIngredientRepository,
  SpoonacularIngredientRepository,
  SupabaseIngredientRepository,
} from '../repository/ingredient.repository';
import { resolveDataSource, DataSource } from '../utils/data-source.util';

// ─── Repository factory (lazy singleton per data source) ─────────────────────
const repositoryCache = new Map<DataSource, IIngredientRepository>();

function getRepository(source?: string): IIngredientRepository {
  const dataSource = resolveDataSource(source);
  if (!repositoryCache.has(dataSource)) {
    const repo =
      dataSource === 'supabase'
        ? new SupabaseIngredientRepository()
        : new SpoonacularIngredientRepository();
    repositoryCache.set(dataSource, repo);
  }
  return repositoryCache.get(dataSource)!;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class IngredientService {
  async searchIngredients(keyword: string, source?: string): Promise<IIngredient[]> {
    return getRepository(source).searchIngredients(keyword);
  }

  async getPopularIngredients(source?: string): Promise<IIngredient[]> {
    return getRepository(source).getPopularIngredients();
  }
}