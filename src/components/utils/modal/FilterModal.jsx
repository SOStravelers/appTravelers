// components/utils/FilterModal.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import languageData from "@/language/filterModal.json";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
/**
 * Modal de filtros con:
 *  • keyword ≥ 4 caracteres
 *  • min-price y max-price siempre positivos
 *  • error solo en el campo Max cuando max < min
 *  • “0” se usa como *placeholder*; si el usuario escribe 0 se trata como nulo
 */
export default function FilterModal({ isOpen, onClose, onApply }) {
  const { filters, setFilters, language } = useStore();

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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Limpieza al desmontar
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
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
  const okInput = `${base} border border-gray-300 bg-gray-100 focus:border-blueBorder`;
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
        className={`bg-backgroundModal rounded-xl w-full max-w-md p-4 mx-4 transform transition-all
          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 translate-y-4"
          }`}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg text-textColor font-semibold">
            {languageData.title[language]}
          </h3>
          <button onClick={onClose} className="text-textColorGray text-lg">
            ✕
          </button>
        </div>

        {/* body */}
        <div className="space-y-4">
          {/* keyword */}
          <div>
            <label className="block text-xs text-textColor mb-2 font-medium">
              {languageData.keyword[language]}
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. beach"
              className={`w-full px-3 py-2 rounded-md border text-sm
              ${
                errKeyword
                  ? "bg-red-100 text-red-800 border-red-500 placeholder-red-400"
                  : "bg-inputColor text-textColor  border-gray-300 placeholder-textColorGrayReverse"
              }
              focus:outline-none focus:ring-1 focus:ring-textColor transition duration-200
            `}
            />

            {errKeyword ? (
              <p className="text-red-600 text-xs mt-1">{errKeyword}</p>
            ) : (
              <p className="h-5"></p>
            )}
          </div>

          {/* price */}
          <div>
            <label className="block text-xs text-textColor font-medium">
              {languageData.price[language] + " USD"}
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                type="number"
                placeholder="0"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={`w-1/2 px-3 py-2 rounded-md border text-sm
        ${
          errMax
            ? "bg-red-100 text-red-800 border-red-500 placeholder-red-400"
            : "bg-inputColor text-textColor border-gray-300 placeholder-textColorGrayReverse placeholder-text-sm"
        }
        focus:outline-none focus:ring-1 focus:ring-textColor transition duration-200
      `}
              />
              <input
                type="number"
                placeholder="100"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={`w-1/2 px-3 py-2 rounded-md border text-sm
        ${
          errMax
            ? "bg-red-100 text-red-800 border-red-500 placeholder-red-400"
            : "bg-inputColor text-textColor border-gray-300 placeholder-textColorGrayReverse"
        }
        focus:outline-none focus:ring-1 focus:ring-textColor transition duration-200
      `}
              />
            </div>
            {errMax ? (
              <p className="text-red-600 text-xs mt-1">{errMax}</p>
            ) : (
              <p className="h-5"></p>
            )}
          </div>

          {/* apply */}

          <OutlinedButton
            onClick={handleApply}
            text={languageData.applyButton[language]}
            px={0}
            py={2}
            dark="darkHeavy"
            textSize="text-xs"
            textColor="text-white"
            disabled={errKeyword || errMax}
            buttonCenter={true}
          />
        </div>
      </div>
    </div>
  );
}
