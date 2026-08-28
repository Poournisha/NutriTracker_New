export interface MealItem {
  id?: number;
  meal_id?: number;
  food_id: number;
  food_name: string;
  category?: string;
  confidence: number;
  bbox?: number[];
  estimated_grams: number;
  portion_category: 'Small' | 'Medium' | 'Large' | 'Very Large';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  iron: number;
  calcium: number;
}

export interface Meal {
  id: number;
  user_id: number;
  image_path?: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  meal_date: string;
  meal_time: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_iron: number;
  total_calcium: number;
  items: MealItem[];
  created_at: string;
}

export interface AnalysisResult {
  image_path: string;
  image_quality: {
    width: number;
    height: number;
    brightness: number;
    blur_metric: number;
  };
  detected_items: MealItem[];
  meal_totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    iron: number;
    calcium: number;
  };
  demo_mode: boolean;
  disclaimer: string;
}
