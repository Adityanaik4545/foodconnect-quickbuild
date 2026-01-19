import React from 'react'

const LocationFields = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">
          fill details about the Location
        </h3>
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
      </div>
    </>
  )
}

export default LocationFields
