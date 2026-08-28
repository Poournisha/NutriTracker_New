import React, { useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { User, ActivityLevel, WorkoutType, FitnessGoal, BmiInfo } from '../types/user';
import { NutritionTargets } from '../types/nutrition';
import { User as UserIcon, Activity, Target, Save, CheckCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: 22,
    gender: 'male',
    height: 170,
    weight: 65,
    activity_level: 'Moderately Active' as ActivityLevel,
    workout_type: 'Gym' as WorkoutType,
    fitness_goal: 'Weight Maintenance' as FitnessGoal,
  });

  const [bmiInfo, setBmiInfo] = useState<BmiInfo | null>(null);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.getProfile();
      if (res.success) {
        const u: User = res.data.user;
        setFormData({
          name: u.name || '',
          age: u.age || 22,
          gender: u.gender || 'male',
          height: u.height || 170,
          weight: u.weight || 65,
          activity_level: (u.activity_level || 'Moderately Active') as ActivityLevel,
          workout_type: (u.workout_type || 'Gym') as WorkoutType,
          fitness_goal: (u.fitness_goal || 'Weight Maintenance') as FitnessGoal,
        });
        setBmiInfo(res.data.bmi);
        setTargets(res.data.targets);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await profileApi.updateProfile(formData);
      if (res.success) {
        updateUser(res.data.user);
        setBmiInfo(res.data.bmi);
        setTargets(res.data.targets);
        setSuccessMsg('Profile updated and daily targets recalculated!');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading your profile data..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Personal Nutrition Profile</h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure your physical metrics and health goals to determine your daily target macros.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 border-b pb-3">
              <UserIcon className="w-4 h-4 text-emerald-600" /> Basic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="20"
                  max="300"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Activity Level</label>
                <select
                  value={formData.activity_level}
                  onChange={(e) => setFormData({ ...formData, activity_level: e.target.value as ActivityLevel })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Sedentary">Sedentary (Little or no exercise)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/wk)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/wk)</option>
                  <option value="Very Active">Very Active (6-7 days/wk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Workout Type</label>
                <select
                  value={formData.workout_type}
                  onChange={(e) => setFormData({ ...formData, workout_type: e.target.value as WorkoutType })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="None">None</option>
                  <option value="Walking">Walking</option>
                  <option value="Running">Running</option>
                  <option value="Gym">Gym / Weightlifting</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fitness Goal</label>
                <select
                  value={formData.fitness_goal}
                  onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value as FitnessGoal })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Weight Maintenance">Weight Maintenance</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="General Health">General Health</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-6 disabled:opacity-50 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Recalculating Targets...' : 'Save & Update Targets'}</span>
            </button>
          </form>
        </div>

        {/* Calculated Stats Sidebar */}
        <div className="space-y-6">
          {/* BMI Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-600" /> Body Mass Index (BMI)
            </h3>
            <div className="text-center py-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <span className="text-3xl font-extrabold text-emerald-700">{bmiInfo?.bmi || '--'}</span>
              <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">
                Category: {bmiInfo?.category || 'N/A'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
              {bmiInfo?.disclaimer || "Nutrition estimates are informational."}
            </p>
          </div>

          {/* Targets Card */}
          {targets && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-emerald-600" /> Daily Target Macros
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Calories</span>
                  <span className="font-bold text-gray-900">{targets.calorie_target} kcal</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Protein</span>
                  <span className="font-bold text-emerald-700">{targets.protein_target} g</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Carbohydrates</span>
                  <span className="font-bold text-gray-900">{targets.carbs_target} g</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Fat</span>
                  <span className="font-bold text-gray-900">{targets.fat_target} g</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Iron</span>
                  <span className="font-bold text-gray-900">{targets.iron_target} mg</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold">
                  <span className="text-gray-500">Calcium</span>
                  <span className="text-gray-900">{targets.calcium_target} mg</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
