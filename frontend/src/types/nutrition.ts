export interface NutritionTargets {
  id?: number;
  user_id?: number;
  calorie_target: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  iron_target: number;
  calcium_target: number;
  calculated_at?: string;
}

export interface IntakeSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  iron: number;
  calcium: number;
}

export interface DeficiencyAlert {
  nutrient: string;
  label: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  consumed: number;
  target: number;
  ratio_pct: number;
  message: string;
}

export interface FoodSuggestion {
  id: number;
  food_name: string;
  category: string;
  calories_per_100g: number;
  nutrient_amount?: number;
}

export interface Recommendation {
  nutrient: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  suggested_foods: FoodSuggestion[];
}
