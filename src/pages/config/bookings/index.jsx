// pages/config/booking/index.jsx
import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import ServiceService from "@/services/ServiceService";
import CustomSelector from "@/components/utils/selector/CustomSelector";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { formatearFechaCortaDesdeISO, formatPrice } from "@/utils/format";
import Modal from "@/components/utils/modal/ConfirmModal";
import TablePriceSummary from "@/components/utils/cards/tablePrice";

const STATUS_COLORS = {
  confirmed: "bg-green-50",
  cancelled: "bg-red-50",
  requested: "bg-gray-100",
  completed: "bg-blue-50",
};

export default function BookingConfigPage() {
  const { language } = useStore();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [openRow, setOpenRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 15);
    return d.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  });

  const [status, setStatus] = useState(["confirmed", "requested"]);
  const [filtersToApply, setFiltersToApply] = useState(null);

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const toggleStatus = (s) => {
    setStatus((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const fetchServices = async () => {
    try {
      const res = await ServiceService.list();
      const opts = [
        { value: "all", label: "Todos" },
        ...res.data.docs.map((s) => ({
          value: s._id,
          label: s.name?.es || "Sin nombre",
        })),
      ];
      setServices(opts);
    } catch (err) {
      console.error("Error cargando servicios:", err);
    }
  };

  const fetchBookings = async (filters) => {
    try {
      setLoading(true);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        timeZone: tz,
        isoTime: new Date().toISOString(),
        range: "custom",
        start: `${filters.startDate}T00:00:00`,
        end: `${filters.endDate}T23:59:59`,
        status: filters.status,
        language,
        typeRequest: "admin",
      };
      if (filters.selectedService && filters.selectedService !== "all") {
        payload.service = filters.selectedService;
      }

      const res = await BookingService.getByRange(payload);
      setBookings(res.data);
    } catch (e) {
      console.error("Error al cargar bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // Carga inicial con filtros por defecto
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetchBookings({
      timeZone: tz,
      startDate,
      endDate,
      status,
      selectedService: null,
    });
  }, []);

  const handleApplyFilters = () => {
    const newFilters = {
      startDate,
      endDate,
      status,
      selectedService: selectedService?.value || null,
    };
    setFiltersToApply(newFilters);
    fetchBookings(newFilters);
  };

  const handleOpenModal = (booking, action) => {
    setModalData({ booking, action });
    setModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mb-20">
      <h1 className="text-2xl font-bold mb-6">Gestión de Bookings</h1>

      {/* Filtros */}
      <div className="grid sm:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Estado</label>
          <div className="flex flex-col gap-1">
            {["confirmed", "requested", "cancelled", "completed"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={status.includes(s)}
                  onChange={() => toggleStatus(s)}
                  className="accent-blue-600"
                />
                <span className={`text-xs font-medium uppercase ${s}`}>
                  {s}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Servicio</label>
          <CustomSelector
            options={services}
            value={selectedService}
            onChange={setSelectedService}
            placeholder="Selecciona un servicio"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-center py-10">Cargando…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2"># Booking</th>
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Pago</th>
                <th className="text-left p-2 hidden sm:table-cell">Estado</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const bgColor = STATUS_COLORS[b.status] || "bg-white";
                return (
                  <React.Fragment key={b._id}>
                    <tr className={`${bgColor} border-b`}>
                      <td className="p-2 flex gap-2 items-center">
                        <button
                          onClick={() => toggleRow(b._id)}
                          className="text-gray-600"
                        >
                          {openRow === b._id ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </button>
                        <span className="font-medium">
                          {b.idKey} –{" "}
                          {typeof b.subservice?.name === "string"
                            ? b.subservice.name
                            : b.subservice?.name?.es || "Sin nombre"}
                        </span>
                      </td>
                      <td className="py-2 px-1">
                        {
                          formatearFechaCortaDesdeISO(
                            b.startTime?.isoTime,
                            language,
                            "br"
                          ).formatedDateShort
                        }
                      </td>
                      <td className="py-2 px-1">
                        {formatPrice(b.price.grossAmount, b.currency)}
                      </td>
                      <td className="p-2">
                        <span className="text-xs font-semibold  text-gray-700">
                          {b.paymentStatus || "unpaid"}
                        </span>
                      </td>
                      <td className="p-2 hidden sm:table-cell">
                        <span className="text-xs font-semibold  text-gray-700">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                    {openRow === b._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="p-4 text-sm">
                          <p>
                            <strong>Servicio:</strong>{" "}
                            {typeof b.service?.name === "string"
                              ? b.service.name
                              : b.service?.name?.es}
                          </p>
                          <p>
                            <strong>Subservicio:</strong>{" "}
                            {typeof b.subservice?.name === "string"
                              ? b.subservice.name
                              : b.subservice?.name?.es}
                          </p>
                          <div className="my-3">
                            <TablePriceSummary
                              confirmed={b?.status || "confirmed"}
                              price={b?.price || {}}
                            />
                          </div>

                          {/* BOTONES CONTEXTUALES */}
                          <div className="flex flex-wrap gap-3 mt-4">
                            {b.status === "requested" && (
                              <>
                                <button
                                  className="bg-green-600 text-white px-4 py-1 rounded"
                                  onClick={() => handleOpenModal(b, "confirm")}
                                >
                                  Confirmar
                                </button>
                                <button
                                  className="bg-red-600 text-white px-4 py-1 rounded"
                                  onClick={() => handleOpenModal(b, "cancel")}
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            {b.status === "confirmed" &&
                              (b.paymentStatus === "unpaid" ||
                                (Array.isArray(b.payments) &&
                                  b.payments.length === 0)) && (
                                <>
                                  <button
                                    className="bg-blue-600 text-white px-4 py-1 rounded"
                                    onClick={() =>
                                      handleOpenModal(b, "capturePayment")
                                    }
                                  >
                                    Capturar pago
                                  </button>
                                  <button
                                    className="bg-red-600 text-white px-4 py-1 rounded"
                                    onClick={() =>
                                      handleOpenModal(b, "cancelWithNoPayment")
                                    }
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                            {b.status === "completed" && (
                              <button
                                className="bg-yellow-600 text-white px-4 py-1 rounded"
                                onClick={() => handleOpenModal(b, "refund")}
                              >
                                Reembolsar total (
                                {formatPrice(b?.price?.netAmount, b?.currency)})
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        message="Confirmar acción en booking (falta integrar)"
      />
    </div>
  );
}
