import React from 'react'

const FoodTypeSelect = ({onSelect}) => {
  return (
    <>
      <div className="space-y-6">
    <h3 className="text-lg font-semibold text-slate-900">
      What kind of food do you want to donate?
    </h3>

    <div className="grid grid-cols-3 gap-4">
      {["raw", "cooked", "packed"].map((kind) => (
        <button
          key={kind}
          type="button"
          onClick={() => onSelect(kind)}
          className="border rounded-xl py-6 font-semibold capitalize hover:border-emerald-500 hover:bg-emerald-50"
        >
          {kind}
        </button>
      ))}
    </div>
  </div>
    </>
  )
}

export default FoodTypeSelect
