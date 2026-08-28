import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { NutrientCard } from '../components/NutrientCard';
import { DeficiencyAlert } from '../components/DeficiencyAlert';
import { RecommendationCard } from '../components/RecommendationCard';
import { MealCard } from '../components/MealCard';
import { BmiInfo, User } from '../types/user';
import { NutritionTargets, IntakeSummary, DeficiencyAlert as IDeficiencyAlert, Recommendation } from '../types/nutrition';
import { Meal } from '../types/meal';
import { Flame, Activity, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bmi, setBmi] = useState<BmiInfo | null>(null);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [intake, setIntake] = useState<IntakeSummary | null>(null);
  const [deficiencies, setDeficiencies] = useState<IDeficiencyAlert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getDashboardData();
      if (res.success) {
        setBmi(res.data.bmi);
        setTargets(res.data.targets);
        setIntake(res.data.intake);
        setDeficiencies(res.data.deficiencies || []);
        setRecommendations(res.data.recommendations || []);
        setRecentMeals(res.data.recent_meals || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return <LoadingSpinner label="Compiling daily nutrition metrics..." />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">{getGreeting()}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{user?.name}</h1>
          <p className="text-emerald-100/80 text-xs mt-1">
            Goal: <span className="font-semibold text-white">{user?.fitness_goal || 'General Health'}</span> | Activity: <span className="font-semibold text-white">{user?.activity_level || 'Moderate'}</span>
          </p>
        </div>
        <Link
          to="/analyze"
          className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-5 py-3 rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-600" /> Log Meal Photo
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadDashboard} />}

      {/* Main Intake Cards Grid */}
      {targets && intake && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NutrientCard
            title="Calories"
            consumed={intake.calories}
            target={targets.calorie_target}
            unit="kcal"
            icon={<Flame className="w-4 h-4 text-amber-500" />}
            color="bg-amber-500"
          />
          <NutrientCard
            title="Protein"
            consumed={intake.protein}
            target={targets.protein_target}
            unit="g"
            icon={<Activity className="w-4 h-4 text-emerald-600" />}
            color="bg-emerald-500"
          />
          <NutrientCard
            title="Carbohydrates"
            consumed={intake.carbs}
            target={targets.carbs_target}
            unit="g"
            color="bg-blue-500"
          />
          <NutrientCard
            title="Fat"
            consumed={intake.fat}
            target={targets.fat_target}
            unit="g"
            color="bg-purple-500"
          />
          <NutrientCard
            title="Iron"
            consumed={intake.iron}
            target={targets.iron_target}
            unit="mg"
            color="bg-rose-500"
          />
          <NutrientCard
            title="Calcium"
            consumed={intake.calcium}
            target={targets.calcium_target}
            unit="mg"
            color="bg-cyan-500"
          />
        </div>
      )}

      {/* Deficiency Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deficiency Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" /> Intake & Deficiency Alerts
          </h3>
          {deficiencies.length > 0 ? (
            <div className="space-y-3">
              {deficiencies.map((d, idx) => (
                <DeficiencyAlert key={idx} deficiency={d} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 text-center text-xs text-gray-500">
              🎉 No active nutrient deficiencies detected today! Your intake aligns well with targets.
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Hostel Menu Suggestions
          </h3>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((r, idx) => (
                <RecommendationCard key={idx} recommendation={r} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-xs text-gray-500">
              Log meals to generate contextual food suggestions from the hostel menu.
            </div>
          )}
        </div>
      </div>

      {/* Recent Meals Section */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-800">Today's Logged Meals</h3>
          <Link to="/history" className="text-xs font-semibold text-emerald-600 hover:underline">
            View Full History
          </Link>
        </div>

        {recentMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center space-y-3">
            <p className="text-xs text-gray-500 font-medium">No meals logged yet today.</p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Upload Meal Photo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
