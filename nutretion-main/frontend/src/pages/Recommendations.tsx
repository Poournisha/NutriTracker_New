import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { Recommendation } from '../types/nutrition';
import { RecommendationCard } from '../components/RecommendationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

export const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getRecommendations();
      if (res.success) {
        setRecommendations(res.data.recommendations || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Generating personalized food recommendations..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Personalized Food Recommendations</h1>
        <p className="text-xs text-gray-500 mt-1">
          Suggestions based on your fitness goals, activity level, and today's nutrient gaps.
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchRecommendations} />}

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((r, idx) => (
            <RecommendationCard key={idx} recommendation={r} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-xs text-gray-500 space-y-2">
          <UtensilsCrossed className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-700">No active nutrient recommendations right now.</p>
          <p>Log a meal to evaluate your intake against your daily targets.</p>
        </div>
      )}
    </div>
  );
};
