// components/utils/FilterModal.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

/**
 * Modal de filtros con:
 *  • keyword ≥ 4 caracteres
 *  • min-price y max-price siempre positivos
 *  • error solo en el campo Max cuando max < min
 *  • “0” se usa como *placeholder*; si el usuario escribe 0 se trata como nulo
 */
export default function FilterModal({ isOpen, onClose, onApply }) {
  const { filters, setFilters } = useStore();

  /* estado de inputs */
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState(""); // string
  const [maxPrice, setMaxPrice] = useState("");

  /* errores */
  const [errKeyword, setErrKeyword] = useState("");
  const [errMax, setErrMax] = useState("");

  /* ─── cargar valores cada vez que se abre ─── */
  useEffect(() => {
    if (!isOpen) return;

    setKeyword(filters.keyword || "");
    setMinPrice(
      filters.minPrice != null && filters.minPrice !== 0
        ? String(filters.minPrice)
        : ""
    );
    setMaxPrice(
      filters.maxPrice != null && filters.maxPrice !== 0
        ? String(filters.maxPrice)
        : ""
    );
    setErrKeyword("");
    setErrMax("");
  }, [isOpen]);

  /* ─── validación en caliente ─── */
  useEffect(() => {
    /* keyword */
    if (keyword.trim() && keyword.trim().length < 4) {
      setErrKeyword("Min. 4 caracteres");
    } else {
      setErrKeyword("");
    }

    /* precios */
    const toNum = (v) => (v === "" || Number(v) === 0 ? null : Number(v)); // 0 ≈ null
    const min = toNum(minPrice);
    const max = toNum(maxPrice);

    setErrMax("");

    if (
      (min != null && (Number.isNaN(min) || min < 0)) ||
      (max != null && (Number.isNaN(max) || max < 0))
    ) {
      setErrMax("Solo números positivos");
      return;
    }

    if (min != null && max != null && max < min) {
      setErrMax("must be greater than starting price");
    }
  }, [keyword, minPrice, maxPrice]);

  /* ─── aplicar filtros ─── */
  const handleApply = () => {
    if (errKeyword || errMax) return;

    const toNum = (v) => (v === "" || Number(v) === 0 ? null : Number(v)); // 0 ≈ null

    setFilters({
      ...filters,
      keyword: keyword.trim(),
      minPrice: toNum(minPrice),
      maxPrice: toNum(maxPrice),
    });
    onApply();
    onClose();
  };

  /* ─── estilos ─── */
  const base =
    "mt-1 block w-full rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-0 transition-colors";
  const okInput = `${base} border border-gray-300 bg-gray-100 focus:border-gray-500`;
  const errInput = `${base} border border-red-500 bg-gray-100 focus:border-red-600`;

  /* ─── UI ─── */
  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50
        transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-lg w-full max-w-md p-4 mx-4 transform transition-all
          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 translate-y-4"
          }`}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Filter</h3>
          <button onClick={onClose} className="text-gray-500 text-lg">
            ✕
          </button>
        </div>

        {/* body */}
        <div className="space-y-4">
          {/* keyword */}
          <div>
            <label className="block text-xs font-medium">Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. beach"
              className={errKeyword ? errInput : okInput}
            />
            {errKeyword && (
              <p className="text-red-600 text-xs mt-1">{errKeyword}</p>
            )}
          </div>

          {/* price */}
          <div>
            <label className="block text-xs font-medium">Price (USD)</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="number"
                placeholder="0"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={`w-1/2 ${errMax ? errInput : okInput}`}
              />
              <input
                type="number"
                placeholder="100"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={`w-1/2 ${errMax ? errInput : okInput}`}
              />
            </div>
            {errMax && <p className="text-red-600 text-xs mt-1">{errMax}</p>}
          </div>

          {/* apply */}
          <button
            onClick={handleApply}
            disabled={errKeyword || errMax}
            className={`block w-1/2 mx-auto text-white text-xs px-2 py-1.5 rounded-full
              ${
                errKeyword || errMax
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blueBorder hover:bg-blueBorderLight"
              }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
