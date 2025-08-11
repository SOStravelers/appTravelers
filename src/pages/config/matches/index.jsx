// pages/config/match-subservices/index.jsx
import React, { useEffect, useState } from "react";
import SubserviceService from "@/services/SubserviceService";
import CategoryService from "@/services/CategoryService";
import CustomSelector from "@/components/utils/selector/CustomSelector";
import NewSwitch from "@/components/utils/switch/NewSwitch";
import InputText from "@/components/utils/inputs/InputText";
import { useStore } from "@/store";
import { DateTime } from "luxon";
import { FaTimes } from "react-icons/fa";
export default function MatchSubservicesConfigPage() {
  const { language } = useStore();
  const [matchSubservices, setMatchSubservices] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubservice, setSelectedSubservice] = useState(null);
  const [allCategoriesWithProducts, setAllCategoriesWithProducts] = useState(
    []
  );
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [localDateTime, setLocalDateTime] = useState("");
  const [available, setAvailable] = useState(false);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      const subs = await SubserviceService.getByService(
        "67c11c4917c3a7a2c353cb1b"
      );
      const categories = await CategoryService.getCategoriesAndProducts();
      setMatchSubservices(subs.data);
      setAllCategoriesWithProducts(categories.data);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (
      !selectedOption ||
      !matchSubservices.length ||
      !allCategoriesWithProducts.length
    )
      return;
    const sub = matchSubservices.find((s) => s._id === selectedOption.value);
    if (!sub) return;

    setSelectedSubservice(sub);
    setAvailable(sub.eventData?.available || false);
    setEventName(sub.eventData?.name?.es || "");

    const timeZone = sub.country?.timeZone || "America/Sao_Paulo";
    const dt = DateTime.fromISO(sub.eventData?.isoTime, {
      zone: "utc",
    }).setZone(timeZone);
    setLocalDateTime(dt.toFormat("yyyy-MM-dd'T'HH:mm"));

    const mapped = (sub.categories || [])
      .map((cat) => {
        const fullCat = allCategoriesWithProducts.find(
          (c) => c.category._id === cat.category
        );
        if (!fullCat) return null;

        const productsMapped = cat.products.map((p) => {
          const fullProd = fullCat.products.find(
            (fp) => fp._id === (p.product._id || p.product)
          );
          return {
            product: fullProd || {
              _id: p.product,
              name: "Producto no encontrado",
            },
            default: p.default || false,
            price: p.price || { usd: 0, eur: 0, brl: 0 },
          };
        });

        return {
          category: fullCat.category,
          default: cat.default,
          products: productsMapped,
        };
      })
      .filter(Boolean);

    setCategoriesWithProducts(mapped);
  }, [selectedOption, matchSubservices, allCategoriesWithProducts]);

  const handleCategoryDefault = (index) => {
    setCategoriesWithProducts((prev) =>
      prev.map((c, i) => ({ ...c, default: i === index }))
    );
  };

  const handleProductDefault = (catIndex, prodIndex) => {
    setCategoriesWithProducts((prev) =>
      prev.map((c, i) => {
        if (i !== catIndex) return c;
        return {
          ...c,
          products: c.products.map((p, j) => ({
            ...p,
            default: j === prodIndex,
          })),
        };
      })
    );
  };

  const handlePriceChange = (catIdx, prodIdx, currency, value) => {
    setCategoriesWithProducts((prev) => {
      const updated = [...prev];
      updated[catIdx].products[prodIdx].price[currency] =
        value === "" ? "" : Number(value);
      return updated;
    });
  };

  const handleCategoryTypeChange = (index, type) => {
    setCategoriesWithProducts((prev) => {
      const updated = [...prev];
      updated[index].category.type = type;
      return updated;
    });
  };

  const addCategory = () => {
    setCategoriesWithProducts((prev) => [
      ...prev,
      { category: null, default: false, products: [] },
    ]);
  };

  const updateCategory = (index, categoryId) => {
    const selectedCat = allCategoriesWithProducts.find(
      (c) => c.category._id === categoryId
    );
    if (!selectedCat) return;

    setCategoriesWithProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        category: selectedCat.category,
        default: false,
        products: [],
      };
      return updated;
    });
  };

  const addProductToCategory = (catIndex, productId) => {
    const cat = categoriesWithProducts[catIndex];
    const fullCat = allCategoriesWithProducts.find(
      (c) => c.category._id === cat.category._id
    );
    const product = fullCat?.products.find((p) => p._id === productId);
    if (!product) return;

    setCategoriesWithProducts((prev) => {
      const updated = [...prev];
      updated[catIndex].products.push({
        product,
        price: product.price,
        default: false,
      });
      return updated;
    });
  };

  const removeCategory = (index) => {
    setCategoriesWithProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProductFromCategory = (catIndex, prodIndex) => {
    setCategoriesWithProducts((prev) => {
      const updated = [...prev];
      updated[catIndex].products.splice(prodIndex, 1);
      return updated;
    });
  };

  const handleSave = async () => {
    const zone = selectedSubservice.country?.timeZone || "America/Sao_Paulo";
    const isoTime = DateTime.fromFormat(localDateTime, "yyyy-MM-dd'T'HH:mm", {
      zone,
    })
      .toUTC()
      .toISO();

    const payload = {
      _id: selectedSubservice._id,
      eventData: {
        available,
        isoTime,
        name: {
          es: eventName,
          en: eventName,
          pt: eventName,
          fr: eventName,
          de: eventName,
        },
      },
      categories: categoriesWithProducts.map((c) => ({
        category: c.category._id,
        default: c.default,
        products: c.products.map((p) => ({
          product: p.product._id,
          price: p.price,
          default: p.default,
        })),
      })),
    };
    console.log("payload", payload);
    await SubserviceService.updateProductData(payload);
    alert("Cambios guardados correctamente");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 mb-32">
      <h1 className="text-2xl text-textColor font-bold mb-6">
        Configuración de Partidos
      </h1>

      <div className="mb-6">
        <label className="font-semibold text-textColorGray block mb-1">
          Selecciona un partido
        </label>
        <CustomSelector
          options={matchSubservices.map((s) => ({
            value: s._id,
            label: s.name?.es,
          }))}
          value={selectedOption}
          onChange={(val) => setSelectedOption(val)}
          placeholder="Elegir subservicio"
        />
      </div>

      {selectedSubservice && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="font-medium text-textColorGray block mb-1">
                Nombre del evento
              </label>
              <InputText
                className="w-full border rounded px-3 py-2"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium text-textColorGray block mb-1">
                Fecha y hora (local)
              </label>
              <InputText
                className="w-full border rounded px-3 py-2"
                type="datetime-local"
                value={localDateTime}
                onChange={(e) => setLocalDateTime(e.target.value)}
                textColorClass="text-white"
              />
            </div>
            <div className="flex text-textColorGray items-center mt-6 gap-2">
              <label>Disponible:</label>
              <NewSwitch checked={available} onChange={setAvailable} />
            </div>
          </div>

          <div className="space-y-6 ">
            {categoriesWithProducts.map((c, i) => (
              <div
                key={i}
                className="bg-backgroundModal border shadow-sm rounded-lg p-4"
              >
                {!c.category ? (
                  <CustomSelector
                    placeholder="Seleccionar categoría"
                    options={allCategoriesWithProducts
                      .filter(
                        (cat) =>
                          !categoriesWithProducts.some(
                            (cc) => cc.category?._id === cat.category._id
                          )
                      )
                      .map((cat) => ({
                        value: cat.category._id,
                        label: cat.category.title?.[language],
                      }))}
                    onChange={(val) => updateCategory(i, val.value)}
                  />
                ) : (
                  <>
                    <div className="flex justify-between mb-3 ">
                      <h2 className="font-semibold text-textColorGray text-lg">
                        {c.category.title?.[language]}
                      </h2>
                      <FaTimes
                        onClick={() => removeCategory(i)}
                        className="text-red-500 cursor-pointer"
                        size={28}
                      />
                    </div>
                    <div className="flex justify-between mb-10">
                      <div className="flex items-center mt-1 gap-2">
                        <span className="text-sm text-textColorGray text-gray-600 italic">
                          Tipo:
                        </span>
                        <CustomSelector
                          className="w-48" // antes era w-40 o w-32, ahora es más ancho
                          value={{
                            value: c.category.type,
                            label: c.category.type,
                          }}
                          options={["select", "free"].map((t) => ({
                            value: t,
                            label: t,
                          }))}
                          onChange={(val) =>
                            handleCategoryTypeChange(i, val.value)
                          }
                        />
                      </div>
                      <div className="text-sm text-textColorGray flex items-center gap-2">
                        Default:
                        <NewSwitch
                          checked={c.default}
                          onChange={() => handleCategoryDefault(i)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {c.category && (
                  <div className="space-y-2">
                    {c.products.map((p, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-1  gap-2 items-center text-sm mb-8"
                      >
                        <div className="grid grid-cols-3  gap-3 items-center text-sm mb-8">
                          <div className="text-md text-textColorGray">
                            {p.product.name[language]}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="mr-1 text-textColorGray">
                              Default:
                            </div>
                            <NewSwitch
                              checked={p.default}
                              onChange={() => handleProductDefault(i, j)}
                            />
                          </div>
                          <div className="flex items-center justify-end">
                            <FaTimes
                              onClick={() => removeProductFromCategory(i, j)}
                              className="text-red-500 cursor-pointer"
                              size={20}
                            />
                          </div>
                        </div>
                        {["usd", "eur", "brl"].map((cur) => (
                          <div
                            key={cur}
                            className="grid grid-cols-3 items-center"
                          >
                            <label className="text-xs text-textColorGray uppercase">
                              {cur}
                            </label>
                            <InputText
                              type="number"
                              value={p.price[cur]}
                              onChange={(e) =>
                                handlePriceChange(i, j, cur, e.target.value)
                              }
                              className="border rounded px-2 py-1 min-w-[60px]"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className="pt-5 sm:w-1/3">
                      <CustomSelector
                        placeholder="Agregar producto"
                        value={null}
                        options={
                          allCategoriesWithProducts
                            .find((cat) => cat.category._id === c.category._id)
                            ?.products.filter(
                              (p) =>
                                !c.products.some(
                                  (cp) =>
                                    (typeof cp.product === "string"
                                      ? cp.product
                                      : cp.product._id) === p._id
                                )
                            )
                            .map((p) => ({
                              value: p._id,
                              label: p.name[language],
                            })) || []
                        }
                        onChange={(val) => addProductToCategory(i, val.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={addCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Categoría
              </button>
              <button
                onClick={handleSave}
                className=" mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
