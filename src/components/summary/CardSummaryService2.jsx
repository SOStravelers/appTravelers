import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { delay } from "@/utils/delayFunction";
import { useStore } from "@/store";
import ImageFullScreenViewer from "@/components/utils/modal/ImageFullScreenViewer";
import {
  formatearFechaCompletaDesdeISO,
  sumarMinutosAISO,
  formatPrice,
  isBeforeHoursThreshold,
} from "@/utils/format";
import languageData from "@/language/newSummary.json";
import ItemService from "@/services/ItemService";

export default function CardSummaryService({ statusExpanded }) {
  /* ---------------------------------------------------------------- *\
     STORE / ROUTER
  \* ---------------------------------------------------------------- */
  const router = useRouter();
  const id = router?.query?.id;
  const { service, setService, language, currency } = useStore();
  const { imgUrl, name, startTime, duration, canCancel, timeUntilCancel } =
    service;

  /* ---------------------------------------------------------------- *\
     LOCAL UI STATE
  \* ---------------------------------------------------------------- */
  const thisLanguage = languageData.confirmSelection;
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [hasCancel, setHasCancel] = useState(false);
  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  const [openImage, setOpenImage] = useState(null);

  /* items & user selections */
  const [sections, setSections] = useState([]);
  const [selections, setSelections] = useState({}); // key = `${sIdx}-${pIdx}` → qty OR 1
  const [selectedInSelect, setSelectedInSelect] = useState({}); // key = sIdx → pIdx

  /* ---------------------------------------------------------------- *\
     FETCH AVAILABLE ITEMS
  \* ---------------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await ItemService.getItemsBySubservice(
          id,
          "2025-07-14T15:00:00-03:00"
        );
        setSections(res.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id, startTime?.isoTime]);

  /* ---------------------------------------------------------------- *\
     HOUSEKEEPING
  \* ---------------------------------------------------------------- */
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => setExpanded(statusExpanded), [statusExpanded]);

  useEffect(() => {
    if (canCancel) {
      setHasCancel(isBeforeHoursThreshold(startTime.isoTime, timeUntilCancel));
    }
  }, [canCancel, startTime, timeUntilCancel]);

  useEffect(() => {
    setStartDate(formatearFechaCompletaDesdeISO(startTime.isoTime, language));
    setEndDate(
      formatearFechaCompletaDesdeISO(
        sumarMinutosAISO(startTime.isoTime, duration),
        language
      )
    );
  }, [startTime, duration, language]);

  /* ---------------------------------------------------------------- *\
     TOTAL PRICE  (memoised so it recalculates only on deps change)
  \* ---------------------------------------------------------------- */
  const totalPrice = useMemo(() => {
    return sections.reduce((t, section, sIdx) => {
      return (
        t +
        section.products.reduce((sub, product, pIdx) => {
          if (!product.isActive) return sub;

          const key = `${sIdx}-${pIdx}`;
          const price = product.price?.[currency] || 0;

          if (section.type === "select") {
            if (selectedInSelect[sIdx] === pIdx) {
              return (
                sub +
                (product.hasQuantity ? (selections[key] || 0) * price : price)
              );
            }
            return sub;
          }

          // free
          if (product.hasQuantity) {
            return sub + (selections[key] || 0) * price;
          }
          return selections[key] ? sub + price : sub;
        }, 0)
      );
    }, 0);
  }, [sections, selections, selectedInSelect, currency]);

  /* ---------------------------------------------------------------- *\
     PERSIST CHOICES INTO THE STORE  ➜  service.selectedData + totalPrice
  \* ---------------------------------------------------------------- */
  useEffect(() => {
    // build selectedData in the exact shape you need
    const selectedData = sections.reduce((acc, section, sIdx) => {
      const sel = [];

      section.products.forEach((product, pIdx) => {
        if (!product.isActive) return;
        const key = `${sIdx}-${pIdx}`;

        // item chosen in “select”
        if (section.type === "select") {
          if (selectedInSelect[sIdx] !== pIdx) return;
          sel.push({
            sectionId: section._id,
            productId: product._id,
            name: product.name,
            qty: product.hasQuantity ? selections[key] || 0 : 1,
            priceUnit: product.price?.[currency] || 0,
          });
          return;
        }

        // toggled items in “free”
        if (section.type === "free") {
          const qty = product.hasQuantity
            ? selections[key] || 0
            : selections[key]
            ? 1
            : 0;
          if (qty) {
            sel.push({
              sectionId: section._id,
              productId: product._id,
              name: product.name,
              qty,
              priceUnit: product.price?.[currency] || 0,
            });
          }
        }
      });

      if (sel.length) {
        acc.push({
          sectionId: section._id,
          title: section.title,
          products: sel,
        });
      }
      return acc;
    }, []);
    console.log("a cambiar", totalPrice, selectedData);
    selectedData.totalPrice = totalPrice;
    setService({
      ...service,
      selectedData,
    });
  }, [sections, selections, selectedInSelect, totalPrice, setService]);

  /* ---------------------------------------------------------------- *\
     INTERNAL HELPERS
  \* ---------------------------------------------------------------- */
  const toggleFreeSelection = (sIdx, pIdx, hasQty) => {
    const key = `${sIdx}-${pIdx}`;
    setSelections((prev) => {
      const current = prev[key] || 0;
      const next = hasQty ? (current > 0 ? 0 : 1) : current ? 0 : 1;
      return { ...prev, [key]: next };
    });
  };

  /* ---------------------------------------------------------------- *\
     RENDER
  \* ---------------------------------------------------------------- */
  return (
    <>
      {/* ------------ CARD CONTAINER ------------ */}
      <div className="bg-backgroundCard rounded-xl mt-2 mb-32 shadow w-full max-w-xl overflow-hidden">
        {/* HEADER */}
        <div
          className="flex items-center justify-between mt-2 p-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center flex-1">
            <img
              src={imgUrl}
              alt=""
              className="w-16 h-16 object-cover rounded-lg mr-4 flex-shrink-0"
            />
            <div className="flex flex-col">
              <h2 className="text-sm text-textColor font-semibold line-clamp-2">
                {name?.[language] || ""}
              </h2>
              <p className="text-textColor text-xs">
                {thisLanguage.value[language]}{" "}
                {formatPrice(totalPrice, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* BODY (collapsible) */}
        <div
          className={`px-4 pb-4 transition-max-h duration-300 overflow-hidden ${
            expanded ? "max-h-screen" : "max-h-0"
          }`}
        >
          <hr className="my-2" />

          {/* DATE */}
          <div className="mb-4">
            <p className="font-semibold text-textColor text-sm mb-1">
              {thisLanguage.sections.date.title[language]}
            </p>
            <p className="text-textColorGray text-xs">{startDate?.data}</p>
            <p className="text-textColorGray text-xs">
              {thisLanguage.sections.date.from[language]}{" "}
              {startDate?.stringData} {thisLanguage.sections.date.to[language]}{" "}
              {endDate?.stringData}
            </p>
          </div>

          {/* SECTIONS + PRODUCTS */}
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3 mb-6">
              <p className="font-semibold text-textColor text-sm">
                {section.title[language]}
              </p>

              {section.products.map((product, pIdx) => {
                const key = `${sIdx}-${pIdx}`;
                const isSelected =
                  section.type === "select"
                    ? selectedInSelect[sIdx] === pIdx
                    : selections[key] > 0;

                return (
                  <div
                    key={key}
                    onClick={() => {
                      if (!product.isActive) return;

                      /* ----------------------  “SELECT”  -------------------- */
                      if (section.type === "select") {
                        const same = selectedInSelect[sIdx] === pIdx;

                        if (same) {
                          // unselect
                          setSelectedInSelect((prev) => {
                            const v = { ...prev };
                            delete v[sIdx];
                            return v;
                          });
                          setSelections((prev) => {
                            const v = { ...prev };
                            delete v[key];
                            return v;
                          });
                        } else {
                          // select new
                          setSelectedInSelect((prev) => ({
                            ...prev,
                            [sIdx]: pIdx,
                          }));
                          setSelections((prev) => ({
                            ...prev,
                            [key]: product.hasQuantity ? product.min : 1,
                          }));
                        }
                      }

                      /* -----------------------  “FREE”  ---------------------- */
                      if (section.type === "free" && !product.hasQuantity) {
                        toggleFreeSelection(sIdx, pIdx, false);
                      }
                    }}
                    className={`flex items-center border rounded-lg p-1 transition mb-4 ${
                      !product.isActive
                        ? "bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-1.5 border-blue-border-dark bg-blue-border-dark-opacity"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {/* image */}
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenImage(product.imgUrl);
                      }}
                      className="w-12 h-12 object-cover rounded-lg mr-3 cursor-zoom-in"
                    />

                    {/* description */}
                    <div className="flex flex-col flex-1">
                      <span className="text-sm text-textColor font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-textColorGray">
                        {formatPrice(product.price[currency], currency)}
                      </span>
                    </div>

                    {/* quantity counter */}
                    {product.hasQuantity && isSelected && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const v = (selections[key] || 0) - 1;
                            if (v >= product.min) {
                              setSelections((prev) => ({ ...prev, [key]: v }));
                            }
                          }}
                          className="w-6 h-6 rounded-full bg-buttonGray flex items-center justify-center text-textColor"
                        >
                          –
                        </button>
                        <span className="w-6 text-center text-sm text-textColor">
                          {selections[key] || 0}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const v = (selections[key] || 0) + 1;
                            if (v <= product.max) {
                              setSelections((prev) => ({ ...prev, [key]: v }));
                            }
                          }}
                          className="w-6 h-6 rounded-full bg-buttonGray flex items-center justify-center text-textColor"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex justify-between items-center mt-2">
            <p className="font-semibold text-textColor text-sm">
              {thisLanguage.sections.totalPrice.title[language]}
            </p>
            <p className="text-xs text-textColorGray">
              {formatPrice(totalPrice, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* FULL‑SCREEN IMAGE VIEWER */}
      {openImage && (
        <ImageFullScreenViewer
          src={openImage}
          isOpen={!!openImage}
          onClose={() => setOpenImage(null)}
        />
      )}
    </>
  );
}
