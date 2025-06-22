// pages/subservices/bulk-toggle.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import SubserviceService from "@/services/SubserviceService";
import ServiceService from "@/services/ServiceService"; // ← NUEVO
import { FaChevronDown, FaChevronRight, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // ← NUEVO
import "react-toastify/dist/ReactToastify.css"; // ← NUEVO

/* ---------- switch verde/rojo ---------- */
const Switch = ({ checked, onChange }) => (
  <label className="inline-block relative w-14 h-7 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
    />
    <span
      className={`absolute inset-0 rounded-full transition-colors
        ${checked ? "bg-green-500" : "bg-red-500"} peer-focus:ring-2`}
    />
    <span
      className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow
        transition-transform ${checked ? "translate-x-7" : ""}`}
    />
  </label>
);

const matchName = (nameObj, term) => {
  if (!term) return true;
  const t = term.toLowerCase();
  if (typeof nameObj === "string") return nameObj.toLowerCase().includes(t);
  return Object.values(nameObj).some((v) => v?.toLowerCase().includes(t));
};

export default function BulkTogglePage() {
  const router = useRouter();
  const { language } = useStore();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(new Set());
  const [open, setOpen] = useState(new Set());
  const [search, setSearch] = useState("");

  /* ---------- fetch ---------- */
  useEffect(() => {
    SubserviceService.getAllByService()
      .then(({ data }) => {
        setGroups(data);
        setOpen(new Set(data.map((g) => g._id)));
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- filtrar ---------- */
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    return groups
      .map((g) => {
        const serviceMatch = matchName(g.service.name, search);
        const subMatchs = g.subservices.filter((s) =>
          matchName(s.name, search)
        );
        if (serviceMatch) return g;
        if (subMatchs.length) return { ...g, subservices: subMatchs };
        return null;
      })
      .filter(Boolean);
  }, [groups, search]);

  /* reabrir visibles al buscar */
  useEffect(() => {
    setOpen(new Set(filteredGroups.map((g) => g._id)));
  }, [search, filteredGroups]);

  /* ---------- selección ---------- */
  const isAllChecked = useMemo(
    () =>
      checked.size &&
      groups.every((g) =>
        [g.service._id, ...g.subservices.map((s) => s._id)].every((id) =>
          checked.has(id)
        )
      ),
    [checked, groups]
  );

  const toggle = (id, extras = []) =>
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
        extras.forEach((x) => n.delete(x));
      } else {
        n.add(id);
        extras.forEach((x) => n.add(x));
      }
      return n;
    });

  const toggleService = (g) =>
    toggle(
      g.service._id,
      g.subservices.map((s) => s._id)
    );

  const toggleAll = () =>
    isAllChecked
      ? setChecked(new Set())
      : setChecked(
          new Set(
            groups.flatMap((g) => [
              g.service._id,
              ...g.subservices.map((s) => s._id),
            ])
          )
        );

  /* ---------- cambiar estado con toast & rollback ---------- */
  const updateIsActive = async (type, id, val) => {
    const prev = JSON.parse(JSON.stringify(groups)); // backup profundo rápido
    // optimista
    setGroups((prevG) =>
      prevG.map((g) => ({
        ...g,
        service:
          type === "service" && g.service._id === id
            ? { ...g.service, isActive: val }
            : g.service,
        subservices: g.subservices.map((s) =>
          type === "service" && g.service._id === id
            ? { ...s, isActive: val } // reflejar en hijos
            : type === "subservice" && s._id === id
            ? { ...s, isActive: val }
            : s
        ),
      }))
    );

    try {
      if (type === "service") {
        await ServiceService.changeStatus(id, val);
      } else {
        await SubserviceService.changeStatus(id, val);
      }
      toast.success("Estado actualizado", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    } catch (err) {
      console.error(err);
      setGroups(prev); // rollback
      toast.error("Error al actualizar", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    }
  };

  /* ---------- UI ---------- */
  if (loading) return <p className="p-10 text-lg">Cargando…</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6 md:mt-20 md:ml-60">
      <ToastContainer position="top-right" autoClose={4000} /> {/* NUEVO */}
      <h1 className="text-2xl font-bold mb-6">Servicios y Subservicios</h1>
      {/* buscador */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar servicio o subservicio…"
          className="border rounded px-4 py-2 w-full md:w-1/2"
        />
      </div>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={toggleAll}
                className="accent-green-600 w-4 h-4"
              />
            </th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-center">Activo</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {filteredGroups.map((g) => {
            const serviceOpen = open.has(g._id);
            const toggleOpen = () =>
              setOpen((prev) => {
                const n = new Set(prev);
                n.has(g._id) ? n.delete(g._id) : n.add(g._id);
                return n;
              });

            return (
              <React.Fragment key={g._id}>
                {/* -------- servicio -------- */}
                <tr className="border-b bg-indigo-50">
                  <td className="p-3 text-center align-top">
                    <input
                      type="checkbox"
                      checked={checked.has(g.service._id)}
                      onChange={() => toggleService(g)}
                      className="accent-green-600 w-4 h-4"
                    />
                  </td>

                  <td className="p-3 font-semibold flex items-center gap-1">
                    <button type="button" onClick={toggleOpen}>
                      {serviceOpen ? (
                        <FaChevronDown size={14} className="text-gray-600" />
                      ) : (
                        <FaChevronRight size={14} className="text-gray-600" />
                      )}
                    </button>
                    {typeof g.service.name === "string"
                      ? g.service.name
                      : g.service.name[language] || g.service.name.es}
                  </td>

                  <td className="p-3 text-center">
                    <Switch
                      checked={g.service.isActive}
                      onChange={(v) =>
                        updateIsActive("service", g.service._id, v)
                      }
                    />
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        router.push(`/subservice/info/${g.service._id}`)
                      }
                      className="text-blue-600 underline flex items-center gap-1"
                    >
                      <FaEdit className="md:hidden" />
                      <span className="hidden md:inline">Ir a editar</span>
                    </button>
                  </td>
                </tr>

                {/* -------- subservicios -------- */}
                {serviceOpen &&
                  g.subservices.map((s) => (
                    <tr key={s._id} className="border-b">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={checked.has(s._id)}
                          onChange={() => toggle(s._id)}
                          className="accent-green-600 w-4 h-4"
                        />
                      </td>

                      <td className="p-3 pl-8">
                        {typeof s.name === "string"
                          ? s.name
                          : s.name[language] || s.name.es}
                      </td>

                      <td className="p-3 text-center">
                        <Switch
                          checked={s.isActive}
                          onChange={(v) =>
                            updateIsActive("subservice", s._id, v)
                          }
                        />
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            router.push(`/subservice/info/${s._id}`)
                          }
                          className="text-blue-600 underline flex items-center gap-1"
                        >
                          <FaEdit className="md:hidden" />
                          <span className="hidden md:inline">Ir a editar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
