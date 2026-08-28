export type Role = 'USER' | 'ADMIN';
export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
export type WorkoutType = 'None' | 'Walking' | 'Running' | 'Gym' | 'Sports' | 'Other';
export type FitnessGoal = 'Weight Loss' | 'Weight Maintenance' | 'Muscle Building' | 'General Health';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  activity_level: ActivityLevel | null;
  workout_type: WorkoutType | null;
  fitness_goal: FitnessGoal | null;
  created_at: string;
  updated_at: string;
}

export interface BmiInfo {
  bmi: number | null;
  category: string;
  disclaimer: string;
}
