// pages/config/subservice/update/[id].jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "@/store";
import SubserviceService from "@/services/SubserviceService";
import ServiceService from "@/services/ServiceService";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

/* ——— Quill únicamente con formato de texto ——— */
const TEXT_ONLY_MODULES = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
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

/* ——— constantes de idiomas ——— */
const LANGS = ["es", "en", "pt", "fr", "de"];
const REQUIRED_LANGS = ["es", "en"];
const LANG_LABELS = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
};

export default function EditSubservicePage() {
  const router = useRouter();
  const { id } = router.query;
  const { language } = useStore();
  const emptyName = { es: "", en: "", pt: "", fr: "", de: "" };

  /* ——— state del formulario ——— */
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

  /* ——— state de validación / UI ——— */
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false); // ← NUEVO
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
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

  /* ——— helpers para actualizar arrays ——— */
  const updateArray = (arr, setter, idx, key, value) =>
    setter(arr.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));

  const updateNameInArray = (arr, setter, idx, lang, val) =>
    setter(
      arr.map((it, i) =>
        i === idx ? { ...it, name: { ...it.name, [lang]: val } } : it
      )
    );

  /* ——— cargar servicios activos ——— */
  useEffect(() => {
    ServiceService.list({ isActive: true, page: 1 })
      .then((res) => setServices(res.data.docs))
      .catch(console.error);
  }, []);

  /* ——— cargar subservicio existente ——— */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    SubserviceService.getById(id)
      .then(({ data }) => {
        if (!data || typeof data !== "object") return;
        setName(data.name || { ...emptyName });
        setDetails(data.details || { ...emptyName });
        setPriceCategory1(
          data?.price?.category1 != null ? String(data.price.category1) : ""
        );
        setDuration(data?.duration != null ? String(data.duration) : "");
        setServiceId(data?.service?._id || data?.service || "");
        setIncludedList(
          Array.isArray(data.includedList) && data.includedList.length
            ? data.includedList
            : [{ name: { ...emptyName } }]
        );
        setRestrictions(
          Array.isArray(data.restrictions) && data.restrictions.length
            ? data.restrictions
            : [{ name: { ...emptyName } }]
        );
        setRoute(
          Array.isArray(data.route) && data.route.length
            ? data.route
            : [{ name: { ...emptyName }, mapLocation: "" }]
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error("No se pudo cargar el subservicio.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ——— validación local ——— */
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

    REQUIRED_LANGS.forEach((l) => {
      err.name[l] = !name[l]?.trim();
      err.details[l] = !(details[l] || "").replace(/<(.|\n)*?>/g, "").trim();
    });

    err.price = priceCategory1 === "" || isNaN(Number(priceCategory1));
    err.duration = duration === "" || isNaN(Number(duration));
    err.service = !serviceId;
    err.included = !includedList.some(
      (it) => it.name.es.trim() && it.name.en.trim()
    );
    err.restrictions = !restrictions.some(
      (it) => it.name.es.trim() && it.name.en.trim()
    );
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

  /* ——— submit ——— */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return; // evita doble clic
    setSubmitted(true);

    if (!validate()) {
      setShowModal(true);
      toast.error("Completa los campos obligatorios.");
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

    setSaving(true); // bloquea el botón
    try {
      await SubserviceService.updateById(id, payload);
      toast.success("Actualizado con éxito", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    } catch (error) {
      toast.error("Ocurrió un error", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    } finally {
      setSaving(false); // libera el botón
    }
  };

  /* ——— pantalla de carga ——— */
  if (loading) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={4000} />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg font-medium">Cargando…</p>
        </div>
      </>
    );
  }

  /* ——— vista principal ——— */
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
      <ToastContainer position="top-right" autoClose={4000} />

      {showModal && hasErrors && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
        <h1 className="text-2xl font-bold mb-4">Editar Subservicio</h1>

        {/* botones superiores */}
        <div className="flex w-full justify-between my-3">
          <button
            type="submit"
            form="editForm"
            disabled={saving}
            className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/config/subservice/gallery/" + id)}
            className="bg-blue-200 text-gray-800 px-2 ml-2 py-2 rounded hover:bg-blue-300"
          >
            Ir a Galeria
          </button>
        </div>

        {/* ——— selector de idioma ——— */}
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

        {/* ——— formulario ——— */}
        <form id="editForm" onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block   font-bold mb-3">
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

          {/* Descripción */}
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
                modules={TEXT_ONLY_MODULES}
                formats={TEXT_ONLY_FORMATS}
              />
            </div>
          </div>

          {/* Precio y Duración */}
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

          {/* Servicio asociado */}
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
                  {s.name[language] || s.name.es}
                </option>
              ))}
            </select>
          </div>

          {/* Incluye */}
          <fieldset
            className={`mb-6 ${
              submitted && errors.included ? "border border-red-500 p-4" : ""
            }`}
          >
            <legend className="font-bold mb-3">
              6. Listado de que incluye
            </legend>
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

          {/* Restricciones */}
          <fieldset
            className={`mb-6 ${
              submitted && errors.restrictions
                ? "border border-red-500 p-4"
                : ""
            }`}
          >
            <legend className="font-bold mb-3">
              7. Lista de Restricciones
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

          {/* Ruta */}
          <fieldset
            className={`mb-6 ${
              submitted && errors.route ? "border border-red-500 p-4" : ""
            }`}
          >
            <legend className="font-bold mb-3">
              8. Lista de Ruta del tour
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
          <div className="flex w-full justify-between mt-8">
            <div></div>
            <button
              type="submit"
              disabled={saving}
              className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Guardando…" : "Guardar Cambios"}
            </button>
            {/* 
            <button
              type="button"
              onClick={() => router.push("/config/subservice/gallery/" + id)}
              className="bg-blue-200 text-gray-800 px-6 py-2 rounded hover:bg-blue-300"
            >
              Ir a Galeria
            </button> */}
          </div>
        </form>
      </div>
    </>
  );
}
