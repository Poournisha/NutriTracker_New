import React, { useEffect, useState } from 'react';
import { reportApi } from '../api/reportApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';

export const WeeklyReports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportApi.getWeeklyReport();
      if (res.success) {
        setReportData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate weekly report.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Generating 7-day nutritional trend analytics..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Weekly Nutritional Report</h1>
        <p className="text-xs text-gray-500 mt-1">
          7-day intake trends, macro distribution, and consistency metrics.
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchReport} />}

      {reportData && (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Avg Daily Calories</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{reportData.averages.calories} kcal</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Avg Daily Protein</span>
                  <h3 className="text-xl font-extrabold text-emerald-700">{reportData.averages.protein} g</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Meals Logged</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{reportData.total_meals_logged} meals</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Calorie Trend</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{reportData.calorie_trend}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calories Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-gray-800 mb-4">Daily Calorie Intake (kcal)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.daily_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protein & Carbs Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-gray-800 mb-4">Protein vs Carbohydrates (g)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.daily_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="protein" name="Protein (g)" fill="#059669" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="carbs" name="Carbs (g)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Micronutrient Summary */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-sm text-gray-800 mb-4">7-Day Average Nutrient Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center text-xs">
              <div className="bg-gray-50 p-3 rounded-2xl">
                <span className="text-gray-400 block mb-1">Calories</span>
                <span className="font-extrabold text-gray-900 text-sm">{reportData.averages.calories} kcal</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <span className="text-emerald-700 block mb-1">Protein</span>
                <span className="font-extrabold text-emerald-900 text-sm">{reportData.averages.protein} g</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <span className="text-gray-400 block mb-1">Carbs</span>
                <span className="font-extrabold text-gray-900 text-sm">{reportData.averages.carbs} g</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <span className="text-gray-400 block mb-1">Fat</span>
                <span className="font-extrabold text-gray-900 text-sm">{reportData.averages.fat} g</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <span className="text-gray-400 block mb-1">Iron</span>
                <span className="font-extrabold text-gray-900 text-sm">{reportData.averages.iron} mg</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl">
                <span className="text-gray-400 block mb-1">Calcium</span>
                <span className="font-extrabold text-gray-900 text-sm">{reportData.averages.calcium} mg</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
