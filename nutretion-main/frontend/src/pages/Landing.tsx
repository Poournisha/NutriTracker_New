import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Camera, Activity, Sparkles, LineChart, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-900">
      {/* Header / Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 font-semibold px-4 py-1.5 rounded-full text-xs mb-6 border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Intelligent Nutrition Platform for Hostel Students</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Eat Smarter. Understand Your <span className="text-emerald-600">Nutritional Intake</span>.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
          AI-powered food recognition, portion size estimation, macro/micronutrient deficiency detection, and personalized hostel menu recommendations.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold px-8 py-3.5 rounded-2xl border border-gray-200 shadow-sm transition flex items-center justify-center"
          >
            Existing User Login
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Food Recognition</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              OpenCV quality validation + YOLOv8 object detection + EfficientNetB0 classification to identify hostel dishes instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deficiency & Targets</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Calculates BMI, personalized daily calorie & macro targets, and monitors Protein, Iron, and Calcium intake gaps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contextual AI Assistant</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Ask your AI nutrition assistant for dinner ideas, protein boosts, and hostel menu alternatives tuned to your goals.
            </p>
          </div>
        </div>

        {/* Hostel Focus Section */}
        <div className="mt-20 bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-left max-w-6xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Tailored for Student Life</span>
              <h2 className="text-3xl font-extrabold mt-2 mb-4">Built Specifically for Hostel Mess & Canteen Diets</h2>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                Most general nutrition trackers don't account for hostel dining menus (Dosa, Sambar, Idli, Chapati, Dal). NutriMeasure AI is pre-configured with common Indian hostel foods so you can track real meals effortlesly.
              </p>
              <div className="space-y-3">
                {["20+ Hostel Dish Reference Items", "Geometric Bounding-Box Portion Estimation", "Weekly Nutrient Balance Reports", "Editable Serving Sizes Before Saving"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-800/60 p-6 rounded-2xl border border-emerald-700/50 space-y-4">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <span className="text-xs text-emerald-300 font-medium">Sample Meal Analysis</span>
                <h4 className="font-bold text-base mt-0.5">Dosa + Sambar + Egg</h4>
                <div className="mt-2 text-xs grid grid-cols-3 gap-2 text-center font-bold">
                  <div className="bg-emerald-950/50 p-2 rounded-lg">480 kcal</div>
                  <div className="bg-emerald-950/50 p-2 rounded-lg text-emerald-300">18.5g Protein</div>
                  <div className="bg-emerald-950/50 p-2 rounded-lg">180mg Calcium</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
