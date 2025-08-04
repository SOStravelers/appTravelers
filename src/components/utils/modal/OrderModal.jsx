import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import { formatPrice } from "@/utils/format";
import TablePriceSummary from "@/components/utils/cards/tablePrice";
import { FaRegClipboard } from "react-icons/fa";
import languageData from "@/language/purchase.json";
export default function OrderModal({ isOpen, onClose, booking }) {
  const { language, currency } = useStore();

  const [copied, setCopied] = useState(false);

  const [copiedVisible, setCopiedVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(booking?.purchaseOrder || "");
    setCopied(true);
    setCopiedVisible(true);
    setTimeout(() => setCopiedVisible(false), 1300); // empieza fade-out
    setTimeout(() => setCopied(false), 1500); // luego remueve el tooltip
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm " />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed bg-backgroundModal transition-all duration-300
          w-full max-w-md h-full top-0 right-0 z-50 p-5 
          rounded-none md:rounded-l-xl
          transform
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}

          md:w-[400px]
        `}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-6 mt-3">
          <div className="relative flex items-center gap-2 text-xl text-textColor font-semibold">
            <span>
              {languageData.orderNumber[language]} {booking?.purchaseOrder}
            </span>
            <button
              onClick={handleCopy}
              title="Copiar al portapapeles"
              className="text-textColor hover:text-blueBorder transition relative"
            >
              <FaRegClipboard size={18} />
              {copied && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-7 text-xs bg-black text-white rounded px-2 py-1 shadow-lg z-10 pointer-events-none ${
                    copiedVisible ? "fade-slide-in" : "fade-slide-out"
                  }`}
                >
                  {languageData.copied[language]}
                </div>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-textColor font-semibold text-2xl"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)] px-1">
          {/* Detalles Cliente */}
          <div className="mb-6">
            <h2 className="text-lg text-textColor font-semibold mb-2">
              {languageData?.body?.clientData[language]}
            </h2>
            <div className="text-sm text-textColor px-2  mb-2">
              {languageData?.body?.name[language]}: {""}
              {booking?.clientData?.name}
            </div>
            <div className="text-sm text-textColor px-2  ">
              {languageData?.body?.email[language]}: {""}{" "}
              {booking?.clientData?.email}
            </div>
          </div>
          {/* Detalles Compra */}
          <div className="mb-6">
            <h2 className="text-lg text-textColor font-semibold mb-2">
              {languageData?.body?.summary[language]}
            </h2>
            {booking?.typeService === "product" &&
              booking.categories.map((category) => (
                <div key={category.id} className="mb-3">
                  <div className="text-md text-textColor font-semibold  px-2">
                    {category.title[language]}
                  </div>
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-2 py-1 text-textColor text-sm px-4"
                    >
                      <div className="flex-[2]">{product.name[language]}</div>
                      <div className="flex-[1] text-center">{product.qty}</div>
                      <div className="flex-[1] text-right">
                        {product.priceUnit != null
                          ? formatPrice(product.priceUnit, currency)
                          : formatPrice(0, currency)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
          {/* Resumen Pago */}
          <div className="mx-2">
            <TablePriceSummary
              confirmed={booking?.status || "confirmed"}
              price={booking?.price || {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
