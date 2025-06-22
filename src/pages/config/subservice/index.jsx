import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import SubserviceService from "@/services/SubserviceService";
import ServiceService from "@/services/ServiceService";
import { FiSearch } from "react-icons/fi";
import { FaChevronDown, FaChevronRight, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/utils/modal/ConfirmModal";
import NewSwitch from "@/components/utils/switch/NewSwitch";
import "react-toastify/dist/ReactToastify.css";

/* ───── helper búsqueda ───── */
const matchName = (nameObj, term) => {
  if (!term) return true;
  const t = term.toLowerCase();
  if (typeof nameObj === "string") return nameObj.toLowerCase().includes(t);
  return Object.values(nameObj).some((v) => v?.toLowerCase().includes(t));
};

/* ───── helper toast ───── */
const showToast = (type, msg) => {
  const opts = {
    containerId: "bulk",
    theme: "dark",
    toastId: "bulk-toast",
    autoClose: 1500,
  };
  if (type === "success") toast.success(msg, opts);
  if (type === "error") toast.error(msg, opts);
  if (type === "warn") toast.warn(msg, opts);
};

const inputClasses = `
  mt-1 block w-full border border-gray-300 bg-gray-100
  rounded-md py-2 pr-3 pl-10 text-sm
  focus:outline-none focus:ring-0 focus:border-gray-500
  transition-colors duration-150 ease-in-out
`;

export default function BulkTogglePage() {
  const router = useRouter();
  const { language } = useStore();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(new Set());
  const [open, setOpen] = useState(new Set());
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState({
    open: false,
    msg: "",
    onConfirm: () => {},
  });

  /* ---------- fetch inicial ---------- */
  useEffect(() => {
    SubserviceService.getAllByService()
      .then(({ data }) => {
        setGroups(data);
        setOpen(new Set(data.map((g) => g._id))); // abrir todos al inicio
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- filtrado ---------- */
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    return groups
      .map((g) => {
        const serviceMatch = matchName(g.service.name, search);
        const subsFiltered = g.subservices.filter((s) =>
          matchName(s.name, search)
        );
        if (serviceMatch) return g;
        if (subsFiltered.length) return { ...g, subservices: subsFiltered };
        return null;
      })
      .filter(Boolean);
  }, [groups, search]);

  useEffect(() => {
    if (search.trim()) setOpen(new Set(filteredGroups.map((g) => g._id)));
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

  /* ---------- update individual ---------- */
  const updateIsActive = async (type, id, val) => {
    const prev = JSON.parse(JSON.stringify(groups));

    setGroups((prevG) =>
      prevG.map((g) => {
        if (type === "service" && g.service._id === id)
          return { ...g, service: { ...g.service, isActive: val } };
        if (type === "subservice")
          return {
            ...g,
            subservices: g.subservices.map((s) =>
              s._id === id ? { ...s, isActive: val } : s
            ),
          };
        return g;
      })
    );

    try {
      type === "service"
        ? await ServiceService.changeStatus(id, val)
        : await SubserviceService.changeStatus(id, val);
      showToast("success", "Estado actualizado");
    } catch (err) {
      console.error(err);
      setGroups(prev);
      showToast("error", "Error al actualizar");
    }
  };

  /* ---------- bulk helpers ---------- */
  const getSelectedIds = () => {
    const services = [];
    const subservices = [];
    groups.forEach((g) => {
      if (checked.has(g.service._id)) services.push(g.service._id);
      g.subservices.forEach((s) => {
        if (checked.has(s._id)) subservices.push(s._id);
      });
    });
    return { services, subservices };
  };

  const applyMany = async (isActive) => {
    const { services, subservices } = getSelectedIds();
    if (!services.length && !subservices.length) {
      showToast("warn", "No hay elementos seleccionados");
      return;
    }

    const prev = JSON.parse(JSON.stringify(groups));
    setGroups((prevG) =>
      prevG.map((g) => ({
        ...g,
        service: services.includes(g.service._id)
          ? { ...g.service, isActive }
          : g.service,
        subservices: g.subservices.map((s) =>
          subservices.includes(s._id) ? { ...s, isActive } : s
        ),
      }))
    );

    try {
      await SubserviceService.changeStateMany({
        services,
        subservices,
        isActive,
      });
      showToast("success", "Actualización masiva completada");
      setChecked(new Set());
    } catch (err) {
      console.error(err);
      setGroups(prev);
      showToast("error", "Error en actualización masiva");
    }
  };

  const applyAll = async (isActive) => {
    const prev = JSON.parse(JSON.stringify(groups));
    setGroups((prevG) =>
      prevG.map((g) => ({
        ...g,
        service: { ...g.service, isActive },
        subservices: g.subservices.map((s) => ({ ...s, isActive })),
      }))
    );

    try {
      await SubserviceService.changeStateAll(isActive);
      showToast("success", "Todos los elementos actualizados");
    } catch (err) {
      console.error(err);
      setGroups(prev);
      showToast("error", "Error al actualizar todo");
    }
  };

  /* ---------- modal helpers ---------- */
  const openModalForSelection = (isActive) => {
    const { services, subservices } = getSelectedIds();
    if (!services.length && !subservices.length) {
      showToast("warn", "No hay elementos seleccionados");
      return;
    }
    setModal({
      open: true,
      msg: `¿Desea ${isActive ? "activar" : "desactivar"} estos ${
        services.length
      } servicios y ${subservices.length} subservicios?`,
      onConfirm: () => applyMany(isActive),
    });
  };

  const openModalForAll = (isActive) => {
    const totalServices = groups.length;
    const totalSubs = groups.reduce((acc, g) => acc + g.subservices.length, 0);
    setModal({
      open: true,
      msg: `¿Desea ${
        isActive ? "activar" : "desactivar"
      } TODOS los ${totalServices} servicios y ${totalSubs} subservicios?`,
      onConfirm: () => applyAll(isActive),
    });
  };

  /* ---------- UI ---------- */
  if (loading) return <p className="p-10 text-lg">Cargando…</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 my-12 md:mt-20 md:ml-60">
      <h1 className="text-2xl font-bold mb-4">Servicios y Subservicios</h1>

      {/* Buscador */}
      <div className="mb-6 w-full md:w-1/2">
        <div className="relative">
          {/* Ícono: más grande y centrado */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="text-gray-500 text-lg" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar servicio o subservicio…"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Botones masivos */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => openModalForSelection(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded"
        >
          Activar selección
        </button>
        <button
          onClick={() => openModalForSelection(false)}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded"
        >
          Desactivar selección
        </button>
        <button
          onClick={() => openModalForAll(true)}
          className="ml-auto bg-green-500/20 hover:bg-green-500/30 text-green-700 text-xs px-3 py-1 rounded hidden md:inline"
        >
          Activar todo
        </button>
        <button
          onClick={() => openModalForAll(false)}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-700 text-xs px-3 py-1 rounded hidden md:inline"
        >
          Desactivar todo
        </button>
      </div>

      {/* Tabla */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={toggleAll}
                onClick={(e) => {
                  e.stopPropagation();
                  openModalForAll(!isAllChecked);
                }}
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
                {/* Servicio */}
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
                    <NewSwitch
                      checked={g.service.isActive}
                      onChange={(v) =>
                        updateIsActive("service", g.service._id, v)
                      }
                    />
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        router.push(`/config/service/info/${g.service._id}`)
                      }
                      className="text-blue-600 underline flex items-center gap-1"
                    >
                      <FaEdit className="md:hidden" />
                      <span className="hidden md:inline">Ir a editar</span>
                    </button>
                  </td>
                </tr>

                {/* Subservicios */}
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
                        <NewSwitch
                          checked={s.isActive}
                          onChange={(v) =>
                            updateIsActive("subservice", s._id, v)
                          }
                        />
                      </td>

                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            router.push(`/config/subservice/info/${s._id}`)
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

      {/* Modal */}
      <ConfirmModal
        isOpen={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onConfirm={modal.onConfirm}
        message={modal.msg}
      />
    </div>
  );
}
