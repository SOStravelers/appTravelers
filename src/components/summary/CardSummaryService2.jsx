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
import SubserviceService from "@/services/SubserviceService";

export default function CardSummaryService({ statusExpanded }) {
  const router = useRouter();
  const id = router?.query?.id;
  const { service, setService, language, currency } = useStore();
  const {
    imgUrl,
    name,
    eventData,
    duration,
    canCancel,
    timeUntilCancel,
    startTime,
  } = service;

  const thisLanguage = languageData.confirmSelection;
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [hasCancel, setHasCancel] = useState(false);
  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  const [openImage, setOpenImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [selections, setSelections] = useState({});
  const [selectedInSelect, setSelectedInSelect] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await SubserviceService.getItemsBySubservice(id);
        const sectionsFromBackend = res.data || [];
        setSections(sectionsFromBackend);

        // RECONSTRUIR SELECCIONES SI YA EXISTÍAN
        if (service?.selectedData?.length) {
          const newSelections = {};
          const newSelectedInSelect = {};

          sectionsFromBackend.forEach((section, sIdx) => {
            const storedSection = service.selectedData.find(
              (s) => s.sectionId === section.category._id
            );
            if (!storedSection) return;
            section.products.forEach((product, pIdx) => {
              const storedProduct = storedSection.products.find(
                (p) => p.productId === product._id
              );
              if (!storedProduct) return;
              const key = `${sIdx}-${pIdx}`;
              if (section.category.type === "select") {
                newSelectedInSelect[sIdx] = pIdx;
                newSelections[key] = product.hasQuantity
                  ? storedProduct.qty
                  : 1;
              } else if (section.category.type === "free") {
                newSelections[key] = product.hasQuantity
                  ? storedProduct.qty
                  : 1;
              }
            });
          });

          setSelections(newSelections);
          setSelectedInSelect(newSelectedInSelect);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id, startTime]);

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => setExpanded(statusExpanded), [statusExpanded]);
  function interpolate(str, vars) {
    return str.replace(/\$\{(\w+(\.\w+)*)\}/g, (_, key) => {
      // Permite nested: ej "startTime.stringData"
      return key.split(".").reduce((o, i) => (o ? o[i] : ""), vars);
    });
  }

  useEffect(() => {
    if (canCancel) {
      setHasCancel(isBeforeHoursThreshold(startTime.isoTime, timeUntilCancel));
    }
  }, [canCancel, startTime, timeUntilCancel]);

  useEffect(() => {
    setStartDate(startTime.formatedDate);
    setEndDate(
      formatearFechaCompletaDesdeISO(
        sumarMinutosAISO(startTime.isoTime, duration),
        language
      )
    );
  }, [startTime, duration, language]);

  const totalPrice = useMemo(() => {
    return sections.reduce((t, section, sIdx) => {
      return (
        t +
        section.products.reduce((sub, product, pIdx) => {
          if (!product.isActive) return sub;
          const key = `${sIdx}-${pIdx}`;
          const price = product.price?.[currency] || 0;

          if (section.category?.type === "select") {
            if (selectedInSelect[sIdx] === pIdx) {
              return (
                sub +
                (product.hasQuantity ? (selections[key] || 0) * price : price)
              );
            }
            return sub;
          }

          if (product.hasQuantity) {
            return sub + (selections[key] || 0) * price;
          }
          return selections[key] ? sub + price : sub;
        }, 0)
      );
    }, 0);
  }, [sections, selections, selectedInSelect, currency]);

  useEffect(() => {
    const selectedData = sections.reduce((acc, section, sIdx) => {
      const sel = [];

      section.products.forEach((product, pIdx) => {
        if (!product.isActive) return;
        const key = `${sIdx}-${pIdx}`;
        const sectionType = section.category?.type;

        if (sectionType === "select") {
          if (selectedInSelect[sIdx] !== pIdx) return;
          sel.push({
            sectionId: section.category?._id,
            productId: product._id,
            name: product.name,
            qty: product.hasQuantity ? selections[key] || 0 : 1,
            priceUnit: product.price?.[currency] || 0,
          });
          return;
        }

        if (sectionType === "free") {
          const qty = product.hasQuantity
            ? selections[key] || 0
            : selections[key]
            ? 1
            : 0;
          if (qty) {
            sel.push({
              sectionId: section.category?._id,
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
          sectionId: section.category?._id,
          title: section.category?.title,
          products: sel,
        });
      }
      return acc;
    }, []);
    selectedData["totalPrice"] = totalPrice;
    setService({ ...service, selectedData, totalPrice: totalPrice });
  }, [sections, selections, selectedInSelect, totalPrice, setService]);

  const toggleFreeSelection = (sIdx, pIdx) => {
    const key = `${sIdx}-${pIdx}`;
    setSelections((prev) => {
      const current = prev[key] || 0;
      const next = current ? 0 : 1;
      return { ...prev, [key]: next };
    });
  };

  return (
    <>
      <div className="bg-backgroundCard rounded-xl mt-2 mb-32 shadow w-full max-w-xl overflow-hidden">
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

        <div
          className={`px-4 pb-4 transition-max-h duration-300 overflow-hidden ${
            expanded ? "max-h-screen" : "max-h-0"
          }`}
        >
          <hr className="my-2" />
          <div className="mb-4">
            <p className="font-semibold text-textColor text-sm mb-1">
              {thisLanguage.sections.date.title[language]}
            </p>
            <p className="text-textColorGray text-xs">
              {startTime?.formatedDate}
            </p>
            <p className="text-textColorGray text-xs">
              {thisLanguage.sections.date.from[language]}{" "}
              {startTime?.formatedTime}{" "}
              {thisLanguage.sections.date.to[language]} {endDate.formatedTime}
            </p>
          </div>

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3 mb-6">
              <p className="font-semibold text-textColor text-sm">
                {section.category?.title?.[language]}
              </p>

              {section.products.map((product, pIdx) => {
                const key = `${sIdx}-${pIdx}`;
                const isSelected =
                  section.category?.type === "select"
                    ? selectedInSelect[sIdx] === pIdx
                    : selections[key] > 0;

                return (
                  <div
                    key={key}
                    onClick={() => {
                      if (!product.isActive) return;

                      if (section.category?.type === "select") {
                        const same = selectedInSelect[sIdx] === pIdx;
                        if (same) {
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

                      if (
                        section.category?.type === "free" &&
                        !product.hasQuantity
                      ) {
                        toggleFreeSelection(sIdx, pIdx);
                      }
                    }}
                    className={`flex items-center border rounded-lg p-1 px-2 transition mb-4 ${
                      !product.isActive
                        ? "bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-1.5 border-blue-border-dark bg-blue-border-dark-opacity"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {/* <img
                      src={product.imgUrl}
                      alt={product.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenImage(product.imgUrl);
                      }}
                      className="w-12 h-12 object-cover rounded-lg mr-3 cursor-zoom-in"
                    /> */}

                    <div className="flex flex-col flex-1">
                      <span className="text-sm text-textColor font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-textColorGray">
                        {formatPrice(product.price?.[currency], currency)}
                      </span>
                    </div>

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

          <div className="flex justify-between items-center mt-2">
            <p className="font-semibold text-textColor text-sm">
              {thisLanguage.sections.totalPrice.title[language]}
            </p>
            <p className="text-xs text-textColorGray">
              {formatPrice(totalPrice, currency)}
            </p>
          </div>
        </div>

        <div className=" px-3 mb-16 mt-4">
          {/* Cancelación gratuita */}
          {hasCancel?.isBefore && (
            <>
              <div className="space-y-1 mb-3">
                <p className="font-semibold text-textColorGreen text-sm">
                  {thisLanguage.sections.booking.title[language]}
                </p>
                <p className="text-textColorGray text-xs">
                  {interpolate(
                    thisLanguage.sections.booking.subtitle[language],
                    {
                      displayDate: hasCancel?.cancelTime?.formatedDate,
                      startTime: {
                        stringData: hasCancel?.cancelTime?.formatedTime,
                      },
                    }
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-textColorGreen text-sm">
                  {thisLanguage.sections.freeCancelation.title[language]}
                </p>
                <p className="text-textColorGray text-xs">
                  {interpolate(
                    thisLanguage.sections.freeCancelation.subtitle[language],
                    {
                      displayDate: hasCancel?.cancelTime?.formatedDate,
                      startTime: {
                        stringData: hasCancel?.cancelTime?.formatedTime,
                      },
                    }
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

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
