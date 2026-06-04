/** Ảnh placeholder khi không có hình thực */
export const PLACEHOLDER_IMG = '/assets/icons/chef.svg';

/** Session storage keys — tập trung để tránh typo */
export const SESSION_STORAGE_KEYS = {
  selectedIngredients: 'food-app:selected-ingredients',
  recipe: (id: number) => `food-app:recipe:${id}`,
} as const;
