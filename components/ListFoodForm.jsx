"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createDonation } from '@/app/actions/donations';
import FoodTypeSelect from './FoodTypeSelect';
import RawFoodFields from './RawFoodFields';
import CookedFields from './CookedFields';
import PackedFields from './PackedFields';
import LocationFields from './LocationFields';

export default function ListFoodForm({ onClose }) {
  const [formData, setFormData] = useState({
    mealName: '',
    preparedTime: '',

    quantity: '',
    type: '',
    category: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [step, setStep] = useState(1);
  const [foodCategory, setFoodCategory] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.mealName || !formData.preparedTime || !formData.quantity) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await createDonation({
        mealName: formData.mealName,
        preparedTime: new Date(formData.preparedTime),
        quantity: parseInt(formData.quantity),
        type: formData.type || undefined,
        category: formData.category || undefined,
        description: formData.description || undefined,
        address: formData.address || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const canProceedFromStep2 = () => {
  if (foodCategory === "cooked") {
    return formData.mealName && formData.preparedTime && formData.quantity;
  }
  if (foodCategory === "raw") {
    return formData.mealName && formData.quantity;
  }
  if (foodCategory === "packed") {
    return formData.mealName && formData.quantity;
  }
  return false;
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">List Food Donation</h2>
            <p className="text-sm text-slate-600 mt-1">Share your food with those in need</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {step === 1 && (<FoodTypeSelect onSelect={(kind)=>{
            setFoodCategory(kind)
            setFormData((prev) => ({...prev, category: kind}))
            setStep(2);
          }} />)}

          {step === 2 && foodCategory === "raw" && (
            <RawFoodFields formData={formData} setFormData={setFormData}/>
          )}
          {step === 2 && foodCategory === "cooked" && (
            <CookedFields formData={formData} setFormData={setFormData} />
          )}
          {step === 2 && foodCategory === "packed" && (
            <PackedFields formData={formData} setFormData={setFormData}/>
          )}
          {step === 3  && (
            <LocationFields formData={formData} setFormData={setFormData} />
          )}
{/* fields for food details */}
          {/* <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">
              Meal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="e.g., Fresh Pasta, Vegetable Curry"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">
                Prepared Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="preparedTime"
                value={formData.preparedTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Number of servings"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select type</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Select category</option>
                <option value="cooked">Cooked</option>
                <option value="raw">Raw</option>
                <option value="packed">Packed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your food donation..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-900">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Pickup address"
            />
          </div> */}

          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">
                Latitude (optional)
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="e.g., 40.7128"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-900">
                Longitude (optional)
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="e.g., -74.0060"
              />
            </div>
          </div> */}
          

{/* ACTION BUTTONS */}
<div className="flex gap-4 pt-4 border-t border-slate-200">

  {/* STEP 1 → NO ACTION BUTTONS */}
  {step === 1 && (
    <button
      type="button"
      onClick={onClose}
      className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
    >
      Cancel
    </button>
  )}

  {/* STEP 2 → BACK + NEXT */}
  {step === 2 && (
    <>
      <button
        type="button"
        onClick={() => setStep(1)}
        className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
      >
        Back
      </button>

      <button
        type="button"
        onClick={() => setStep(3)}
         disabled={!canProceedFromStep2()}
        className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all"
      >
        Next
      </button>
    </>
  )}

  {/* STEP 3 → BACK + SUBMIT */}
  {step === 3 && (
    <>
      <button
        type="button"
        onClick={() => setStep(2)}
        className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
      >
        Back
      </button>

      <button
        type="submit"
        disabled={loading}
        className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50"
      >
        {loading ? "Creating..." : "List Food"}
      </button>
    </>
  )}

</div>

        </form>
      </div>
    </div>
  );
}
