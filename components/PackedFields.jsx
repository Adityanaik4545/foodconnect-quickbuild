import React from 'react'

const PackedFields = ({formData, setFormData}) => {
            const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
    <div className="space-y-6">
    <h3 className="text-lg font-semibold text-slate-900">
      fill details about your Packed food
    </h3>
    <label className="block text-sm font-semibold mb-2 text-slate-900">
        Item name <span className="text-red-500">*</span>
    </label>
    <input
        name="mealName"
        value={formData.mealName}
        onChange={handleChange}
      />
    <label className="block text-sm font-semibold mb-2 text-slate-900">
        Expiry Date <span className="text-red-500">*</span>
    </label>
    <input
        name="expiryInput"
        type='datetime-local'
        value={formData.expiryInput}
        onChange={handleChange}
      />
        <label className="block text-sm font-semibold mb-2 text-slate-900">
              Quantity <span className="text-red-500">*</span>
        </label>
    <input
        name="quantity"
        type='number'
        value={formData.quantity}
        onChange={handleChange}
      />
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
    <label className="block text-sm font-semibold mb-2 text-slate-900">
        Description
    </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-xl resize-none"
        />
  </div>
</div>
  )
}

export default PackedFields
