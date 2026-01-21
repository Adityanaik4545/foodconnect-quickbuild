import React from 'react'

const RawFoodFields = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <h3 className="text-2xl font-extralight text-slate-900 mb-8">
          Fill details about your raw food
        </h3>

        {/* Item Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            name="mealName"
            type="text"
            placeholder="e.g., Fresh Tomatoes, Carrots"
            value={formData.mealName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white shadow-sm hover:border-slate-400"
          />
        </div>

        {/* Use Before */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Use Before <span className="text-red-500">*</span>
          </label>
          <input
            name="expiryInput"
            type="datetime-local"
            value={formData.expiryInput}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white shadow-sm hover:border-slate-400"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Quantity (kg/units) <span className="text-red-500">*</span>
          </label>
          <input
            name="quantity"
            type="number"
            min="1"
            placeholder="e.g., 3"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white shadow-sm hover:border-slate-400"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white shadow-sm hover:border-slate-400 cursor-pointer"
          >
            <option value="">Select type</option>
            <option value="veg">🥬 Vegetarian</option>
            <option value="non-veg">🍗 Non-Vegetarian</option>
            <option value="vegan">🌱 Vegan</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Add any special notes, freshness details, or storage conditions..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white shadow-sm hover:border-slate-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RawFoodFields;