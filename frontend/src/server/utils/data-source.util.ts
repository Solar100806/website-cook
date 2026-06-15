import { ENV } from '../config/env';

export type DataSource = 'spoonacular' | 'supabase';

export function resolveDataSource(source?: string): DataSource {
  if (source === 'supabase' || source === 'spoonacular') {
    return source;
  }

  return ENV.DATA_SOURCE === 'supabase' ? 'supabase' : 'spoonacular';
}
