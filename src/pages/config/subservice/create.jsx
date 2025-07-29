// pages/subservices/create.jsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useStore } from "@/store";
import SubserviceService from "@/services/SubserviceService";
import ServiceService from "@/services/ServiceService";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const LANGS = ["es", "en", "pt", "fr", "de"];
const REQUIRED_LANGS = ["es", "en"];
const LANG_LABELS = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
};

const TEXT_ONLY_MODULES = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // basic inline style
    [{ list: "ordered" }, { list: "bullet" }], // lists
    [{ align: [] }], // alignment
    ["clean"], // remove formatting
  ],
  clipboard: {
    matchVisual: false, // keep plain-text when pasting
  },
};

const TEXT_ONLY_FORMATS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
];

export default function NewSubservicePage() {
  const router = useRouter();
  const { language } = useStore();
  const emptyName = { es: "", en: "", pt: "", fr: "", de: "" };

  // form state
  const [activeLang, setActiveLang] = useState(language);
  const [name, setName] = useState({ ...emptyName });
  const [details, setDetails] = useState({ ...emptyName });
  const [priceCategory1, setPriceCategory1] = useState("");
  const [duration, setDuration] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);

  const [includedList, setIncludedList] = useState([
    { name: { ...emptyName } },
  ]);
  const [restrictions, setRestrictions] = useState([
    { name: { ...emptyName } },
  ]);
  const [route, setRoute] = useState([
    { name: { ...emptyName }, mapLocation: "" },
  ]);

  // validation state
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: {},
    details: {},
    price: false,
    duration: false,
    service: false,
    included: false,
    restrictions: false,
    route: false,
  });

  // modal visibility
  const [showModal, setShowModal] = useState(false);

  // fetch active services
  useEffect(() => {
    ServiceService.list({ isActive: true, page: 1 })
      .then((res) => setServices(res.data.docs))
      .catch((err) => console.error("Fetch services:", err));
  }, []);

  const validate = () => {
    const err = {
      name: {},
      details: {},
      price: false,
      duration: false,
      service: false,
      included: false,
      restrictions: false,
      route: false,
    };

    // only Spanish & English required
    REQUIRED_LANGS.forEach((l) => {
      err.name[l] = !name[l]?.trim();
      err.details[l] = !(details[l] || "").replace(/<(.|\n)*?>/g, "").trim();
    });

    err.price = priceCategory1 === "" || isNaN(Number(priceCategory1));
    err.duration = duration === "" || isNaN(Number(duration));
    err.service = !serviceId;

    // includedList: at least one element with ES+EN
    err.included = !includedList.some(
      (it) => it.name.es.trim() && it.name.en.trim()
    );

    // restrictions: same
    err.restrictions = !restrictions.some(
      (it) => it.name.es.trim() && it.name.en.trim()
    );

    // route: at least one with ES+EN+mapLocation
    err.route = !route.some(
      (it) => it.name.es.trim() && it.name.en.trim() && it.mapLocation.trim()
    );

    setErrors(err);

    return !(
      Object.values(err.name).some(Boolean) ||
      Object.values(err.details).some(Boolean) ||
      err.price ||
      err.duration ||
      err.service ||
      err.included ||
      err.restrictions ||
      err.route
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) {
      setShowModal(true);
      return;
    }

    const payload = {
      name,
      details,
      service: serviceId,
      price: { category1: Number(priceCategory1) },
      duration: Number(duration),
      includedList,
      restrictions,
      route,
      isActive: true,
    };
    console.log("Payload:", payload);
    await SubserviceService.post(payload);
    toast.success("Creado con éxito", {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 1200,
    });
    router.push("/config/subservice");
  };

  const updateArray = (arr, setter, idx, key, value) =>
    setter(arr.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));

  const updateNameInArray = (arr, setter, idx, lang, val) =>
    setter(
      arr.map((it, i) =>
        i === idx ? { ...it, name: { ...it.name, [lang]: val } } : it
      )
    );

  // determine if there are errors to show
  const hasErrors =
    submitted &&
    (Object.values(errors.name).some(Boolean) ||
      Object.values(errors.details).some(Boolean) ||
      errors.price ||
      errors.duration ||
      errors.service ||
      errors.included ||
      errors.restrictions ||
      errors.route);

  return (
    <>
      {showModal && hasErrors && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <p className="text-red-700 font-bold mb-4">
              Faltan campos por llenar
            </p>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl my-12 md:my-28 mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Nuevo Subservicio</h1>

        {/* language tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b mb-6">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={`inline-block px-4 py-2 -mb-px ${
                activeLang === l
                  ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveLang(l)}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-bold mb-3">
              1. Nombre ({LANG_LABELS[activeLang]})
            </label>
            <input
              type="text"
              value={name[activeLang]}
              onChange={(e) =>
                setName({ ...name, [activeLang]: e.target.value })
              }
              className={`w-full border rounded px-3 py-2 ${
                submitted &&
                REQUIRED_LANGS.includes(activeLang) &&
                errors.name[activeLang]
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* Details */}
          <div>
            <label className="block font-bold mb-3">
              2. Descripción ({LANG_LABELS[activeLang]})
            </label>
            <div
              className={`border rounded ${
                submitted &&
                REQUIRED_LANGS.includes(activeLang) &&
                errors.details[activeLang]
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <ReactQuill
                value={details[activeLang]}
                onChange={(v) => setDetails({ ...details, [activeLang]: v })}
                theme="snow"
                modules={TEXT_ONLY_MODULES} // ← NEW
                formats={TEXT_ONLY_FORMATS} // ← NEW
              />
            </div>
          </div>

          {/* Price & Duration */}
          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block font-bold mb-3">3. Precio (R$)</label>
              <input
                type="number"
                value={priceCategory1}
                onChange={(e) => setPriceCategory1(e.target.value)}
                className={`w-32 border rounded px-2 py-1 ${
                  submitted && errors.price
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                min="0"
              />
            </div>
            <div>
              <label className="block font-bold mb-3">4. Duración (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={`w-32 border rounded px-2 py-1 ${
                  submitted && errors.duration
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                min="0"
              />
            </div>
          </div>

          {/* Service selector */}
          <div>
            <label className="block font-bold mb-3">5. Servicio Asociado</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                submitted && errors.service
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">-- Selecciona un servicio --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name[language]}
                </option>
              ))}
            </select>
          </div>

          {/* IncludedList */}
          <fieldset
            className={`mb-6 ${
              submitted && errors.included ? "border border-red-500 p-4" : ""
            }`}
          >
            <legend className="font-bold mb-3">6. Lista de que incluye</legend>
            {includedList.map((it, i) => (
              <div key={i} className="mb-4 border p-3 rounded">
                <div className="flex justify-between mb-2">
                  <span>Elemento {i + 1}</span>
                  {includedList.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setIncludedList((list) =>
                          list.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <label className="block mb-1">Nombre ES/EN</label>
                <input
                  type="text"
                  value={it.name[activeLang]}
                  onChange={(e) =>
                    updateNameInArray(
                      includedList,
                      setIncludedList,
                      i,
                      activeLang,
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setIncludedList((list) => [...list, { name: { ...emptyName } }])
              }
              className="text-blue-600"
            >
              + Agregar elemento
            </button>
          </fieldset>

          {/* Restrictions */}
          <fieldset
            className={`mb-6 ${
              submitted && errors.restrictions
                ? "border border-red-500 p-4"
                : ""
            }`}
          >
            <legend className="font-bold mb-3">
              7. Listado de Restricciones
            </legend>
            {restrictions.map((it, i) => (
              <div key={i} className="mb-4 border p-3 rounded">
                <div className="flex justify-between mb-2">
                  <span>Restricción {i + 1}</span>
                  {restrictions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setRestrictions((list) =>
                          list.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <label className="block mb-1">Nombre ES/EN</label>
                <input
                  type="text"
                  value={it.name[activeLang]}
                  onChange={(e) =>
                    updateNameInArray(
                      restrictions,
                      setRestrictions,
                      i,
                      activeLang,
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setRestrictions((list) => [...list, { name: { ...emptyName } }])
              }
              className="text-blue-600"
            >
              + Agregar restricción
            </button>
          </fieldset>

          {/* Route */}
          <fieldset
            className={`mb-6 ${
              submitted && errors.route ? "border border-red-500 p-4" : ""
            }`}
          >
            <legend className="font-bold mb-3">
              8. Listado de Ruta del tour
            </legend>
            {route.map((it, i) => (
              <div key={i} className="mb-4 border p-3 rounded">
                <div className="flex justify-between mb-2">
                  <span>Punto {i + 1}</span>
                  {route.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setRoute((list) => list.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <label className="block mb-1">Nombre ES/EN</label>
                <input
                  type="text"
                  value={it.name[activeLang]}
                  onChange={(e) =>
                    updateNameInArray(
                      route,
                      setRoute,
                      i,
                      activeLang,
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2"
                />
                <label className="block mt-2 mb-1">URL de mapa</label>
                <input
                  type="text"
                  value={it.mapLocation}
                  onChange={(e) =>
                    updateArray(
                      route,
                      setRoute,
                      i,
                      "mapLocation",
                      e.target.value
                    )
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://maps.google.com/…"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setRoute((list) => [
                  ...list,
                  { name: { ...emptyName }, mapLocation: "" },
                ])
              }
              className="text-blue-600"
            >
              + Agregar punto
            </button>
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Crear Subservicio
          </button>
        </form>
      </div>
    </>
  );
}
