// components/utils/FilterModal.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

export default function FilterModal({ isOpen, onClose, onApply }) {
  const { filters, setFilters } = useStore();

  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (isOpen) {
      setKeyword(filters.keyword || "");
      setMinPrice(filters.minPrice != null ? String(filters.minPrice) : "");
      setMaxPrice(filters.maxPrice != null ? String(filters.maxPrice) : "");
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    setFilters({
      ...filters,
      keyword: keyword.trim(),
      minPrice: minPrice === "" ? null : Number(minPrice),
      maxPrice: maxPrice === "" ? null : Number(maxPrice),
    });
    onApply();
    onClose();
  };

  // Smaller, tighter styles
  const inputClasses = `
    mt-1 block w-full border border-gray-300 bg-gray-100
    rounded-md px-2 py-1.5 text-xs
    focus:outline-none focus:ring-0 focus:border-gray-500
    transition-colors duration-150 ease-in-out
  `;

  return (
    <div
      className={`
        fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm
        flex items-center justify-center z-50
        transition-opacity duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white rounded-lg w-full max-w-md p-4 mx-2
          transform transition-all duration-200 ease-out
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Filter</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 focus:outline-none text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {/* Keyword */}
          <div>
            <label className="block text-xs font-medium">Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. beach"
              className={inputClasses}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium">Price (USD)</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={`w-1/2 ${inputClasses}`}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={`w-1/2 ${inputClasses}`}
              />
            </div>
          </div>

          {/* Apply */}
          <button
            onClick={handleApply}
            className="
              block w-1/2 mx-auto bg-blueBorder text-white text-xs px-2 py-1.5 rounded-full
              hover:bg-blueBorderLight focus:outline-none
              transition-colors duration-150 ease-in-out
            "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
