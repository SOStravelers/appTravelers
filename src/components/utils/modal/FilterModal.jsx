// components/utils/FilterModal.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import languageData from "@/language/filterModal.json";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import InputText from "@/components/utils/inputs/InputText";

/**
 * Modal de filtros con:
 *  • keyword ≥ 4 caracteres
 *  • min-price y max-price siempre positivos
 *  • error solo en el campo Max cuando max < min
 *  • “0” se usa como *placeholder*; si el usuario escribe 0 se trata como nulo
 */
export default function FilterModal({ isOpen, onClose, onApply }) {
  const { filters, setFilters, language, currency } = useStore();

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
    const min = toNum(minPrice);
    const max = toNum(maxPrice);

    const newFilters = {
      ...filters,
      keyword: keyword.trim(),
      minPrice: min,
      maxPrice: max,
    };

    // Solo incluir currency si alguno de los dos tiene valor numérico válido
    if (min != null || max != null) {
      newFilters.currency = currency;
    } else {
      delete newFilters.currency;
    }

    setFilters(newFilters);
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

            <InputText
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. beach"
              error={errKeyword}
              className="w-full"
            />

            {errKeyword ? (
              <p className="text-errorColor text-xs mt-1">{errKeyword}</p>
            ) : (
              <p className="h-5"></p>
            )}
          </div>

          {/* price */}
          <div>
            <label className="block text-xs text-textColor font-medium">
              {`${languageData.price[language]} [${currency.toUpperCase()}]`}
              <div className="uppercase"></div>
            </label>
            <div className="flex space-x-2 mt-1">
              <InputText
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min="0"
                error={errMax}
                className="w-1/2 placeholder:text-sm"
              />

              <InputText
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="0"
                min="0"
                error={errMax}
                className="w-1/2 placeholder:text-sm"
              />
            </div>
            {errMax ? (
              <p className="text-errorColor text-xs mt-1">{errMax}</p>
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
