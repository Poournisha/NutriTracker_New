import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealApi } from '../api/mealApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { FoodDetectionCard } from '../components/FoodDetectionCard';
import { AnalysisResult, MealItem } from '../types/meal';
import { Camera, Upload, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const AnalyzeFood: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [editedItems, setEditedItems] = useState<MealItem[]>([]);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Snack' | 'Dinner'>('Lunch');
  const [savingMeal, setSavingMeal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  };

  const runAnalysisPipeline = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setLoadingStep('Checking image quality with OpenCV...');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      setLoadingStep('Detecting food items with YOLOv8...');
      
      const res = await mealApi.analyzeImage(formData);

      if (res.success) {
        setAnalysisResult(res.data);
        setEditedItems(res.data.detected_items || []);
      } else {
        setError(res.error?.message || 'Food image analysis failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error processing food image. Ensure image is clear.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortion = (index: number, grams: number, portionCategory: 'Small' | 'Medium' | 'Large' | 'Very Large') => {
    setEditedItems((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };
      item.estimated_grams = grams;
      item.portion_category = portionCategory;
      
      // Recalculate item nutrients based on grams
      const factor = grams / 100.0;
      item.calories = Math.round((item.calories / (copy[index].estimated_grams / 100)) * factor * 10) / 10;
      item.protein = Math.round((item.protein / (copy[index].estimated_grams / 100)) * factor * 10) / 10;
      item.carbs = Math.round((item.carbs / (copy[index].estimated_grams / 100)) * factor * 10) / 10;
      item.fat = Math.round((item.fat / (copy[index].estimated_grams / 100)) * factor * 10) / 10;
      item.iron = Math.round((item.iron / (copy[index].estimated_grams / 100)) * factor * 10) / 10;
      item.calcium = Math.round((item.calcium / (copy[index].estimated_grams / 100)) * factor * 10) / 10;

      copy[index] = item;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveMeal = async () => {
    if (editedItems.length === 0) {
      setError('Meal must contain at least one food item.');
      return;
    }

    setSavingMeal(true);
    setError(null);

    try {
      const payload = {
        meal_type: mealType,
        image_path: analysisResult?.image_path,
        items: editedItems
      };

      const res = await mealApi.saveMeal(payload);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save meal.');
    } finally {
      setSavingMeal(false);
    }
  };

  // Recalculate summary totals from edited items
  const currentTotals = editedItems.reduce((acc, curr) => {
    acc.calories += curr.calories || 0;
    acc.protein += curr.protein || 0;
    acc.carbs += curr.carbs || 0;
    acc.fat += curr.fat || 0;
    acc.iron += curr.iron || 0;
    acc.calcium += curr.calcium || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, calcium: 0 });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">AI Food Recognition & Portion Analysis</h1>
        <p className="text-xs text-gray-500 mt-1">
          Upload or capture a food photo to detect items, estimate portions, and calculate meal nutrition.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Step 1: Upload Card */}
      {!analysisResult && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center space-y-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-3xl p-10 cursor-pointer transition bg-emerald-50/20 flex flex-col items-center justify-center space-y-4"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Meal preview" className="max-h-64 rounded-2xl object-cover shadow-md" />
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Drag & Drop food image here</h3>
                  <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG, WEBP up to 16MB</p>
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
          </div>

          {selectedFile && (
            <button
              onClick={runAnalysisPipeline}
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50 text-sm"
            >
              <Camera className="w-4 h-4" />
              <span>{loading ? 'Processing ML Pipeline...' : 'Analyze Food Photo'}</span>
            </button>
          )}

          {loading && <LoadingSpinner label={loadingStep} />}
        </div>
      )}

      {/* Step 2: Results Review & Portion Adjustment */}
      {analysisResult && (
        <div className="space-y-6">
          {analysisResult.demo_mode && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-center gap-3 text-xs font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Demo AI Mode Active:</strong> Standard reference predictions are being displayed as trained model weights are currently using fallback mode.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Preview & Detected Food List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
                <img
                  src={previewUrl!}
                  alt="Analyzed food"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-800">Detected Foods ({editedItems.length})</h3>
                <span className="text-xs text-gray-400">Click grams to edit serving size</span>
              </div>

              {editedItems.map((item, idx) => (
                <FoodDetectionCard
                  key={idx}
                  item={item}
                  index={idx}
                  onUpdatePortion={handleUpdatePortion}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </div>

            {/* Meal Totals & Save Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-800 border-b pb-3">Meal Summary</h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snack">Snack</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div className="space-y-2 text-xs border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Calories</span>
                    <span className="font-bold text-gray-900">{Math.round(currentTotals.calories)} kcal</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Protein</span>
                    <span className="font-bold text-emerald-700">{Math.round(currentTotals.protein * 10) / 10} g</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Carbohydrates</span>
                    <span className="font-bold text-gray-900">{Math.round(currentTotals.carbs * 10) / 10} g</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Fat</span>
                    <span className="font-bold text-gray-900">{Math.round(currentTotals.fat * 10) / 10} g</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Iron</span>
                    <span className="font-bold text-gray-900">{Math.round(currentTotals.iron * 10) / 10} mg</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span className="text-gray-500">Total Calcium</span>
                    <span className="text-gray-900">{Math.round(currentTotals.calcium * 10) / 10} mg</span>
                  </div>
                </div>

                <button
                  onClick={handleSaveMeal}
                  disabled={savingMeal || editedItems.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-2xl shadow-md shadow-emerald-100 transition flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{savingMeal ? 'Saving Meal...' : 'Save Meal to Daily Intake'}</span>
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl text-[11px] text-gray-500 leading-relaxed border border-gray-100">
                {analysisResult.disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
