// pages/config/booking/index.jsx
import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import ServiceService from "@/services/ServiceService";
import StripeService from "@/services/StripeService";
import CustomSelector from "@/components/utils/selector/CustomSelector";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import {
  formatearFechaCortaDesdeISO,
  formatPrice,
  isBeforeHoursThreshold,
} from "@/utils/format";
import Modal from "@/components/utils/modal/ConfirmModal";
import TablePriceSummary from "@/components/utils/cards/tablePrice";
import BookingLink from "@/pages/booking-link/[id]";

const STATUS_COLORS = {
  confirmed: "bg-green-100",
  canceled: "bg-red-100",
  requested: "bg-gray-100",
  completed: "bg-blue-100",
};

export default function BookingConfigPage() {
  const { language } = useStore();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("all");
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

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const canCapturePayment = (booking) => {
    if (booking.canCancel) {
      const cancelData = isBeforeHoursThreshold(
        booking.startTime.isoTime,
        booking.timeUntilCancel,
        "es"
      );
      return {
        canCapture: !cancelData.isBefore,
        dataCapture: cancelData.cancelTime,
      };
    } else {
      return {
        canCapture: true,
        dataCapture: null,
      };
    }
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

  const fetchBookings = async ({
    startDate,
    endDate,
    status,
    selectedService,
    paymentStatus,
  }) => {
    try {
      setLoading(true);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        timeZone: tz,
        isoTime: new Date().toISOString(),
        range: "custom",
        start: `${startDate}T00:00:00`,
        end: `${endDate}T23:59:59`,
        status,
        language,
        typeRequest: "admin",
      };

      if (selectedService && selectedService !== "all") {
        payload.service = selectedService;
      }

      if (paymentStatus && paymentStatus !== "all") {
        payload.paymentStatus = paymentStatus;
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
    fetchBookings({
      startDate,
      endDate,
      status,
      selectedService: null,
      paymentStatus: "all",
    });
  }, []);

  const handleApplyFilters = () => {
    fetchBookings({
      startDate,
      endDate,
      status,
      selectedService: selectedService?.value || null,
      paymentStatus,
    });
  };

  const handleOpenModal = (booking, action) => {
    setModalData({ booking, action });
    setModalOpen(true);
  };

  const handleConfirmModal = async () => {
    if (!modalData) return;
    const { booking, action } = modalData;
    try {
      if (action === "confirm") {
        await BookingService.confirm(booking._id);
      } else if (action === "cancel" || action === "cancelWithNoPayment") {
        await BookingService.cancel(booking._id);
      } else if (action === "capturePayment") {
        await StripeService.chargeBooking(booking._id);
      } else if (action === "refund") {
        await StripeService.refund(booking._id);
      }
      await fetchBookings({
        startDate,
        endDate,
        status,
        selectedService: selectedService?.value || null,
        paymentStatus,
      });
    } catch (err) {
      console.error("Error ejecutando acción:", err);
    } finally {
      setModalOpen(false);
    }
  };

  const getModalMessage = () => {
    if (!modalData) return "¿Estás seguro?";
    const { action } = modalData;
    switch (action) {
      case "confirm":
        return "¿Deseas confirmar esta reserva?";
      case "cancel":
      case "cancelWithNoPayment":
        return "¿Deseas cancelar esta reserva?";
      case "capturePayment":
        return "¿Deseas capturar el pago de esta reserva?";
      case "refund":
        return "¿Deseas reembolsar el pago total de esta reserva?";
      default:
        return "¿Estás seguro?";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 py-8 mb-20">
      <h1 className="text-2xl font-bold mb-6">Gestión de Bookings</h1>

      {/* Filtros */}
      <div className="grid sm:grid-cols-6 gap-4 mb-6">
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
            {["confirmed", "requested", "canceled", "completed"].map((s) => (
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
          <label className="text-sm font-medium block mb-1">Pago</label>
          <CustomSelector
            options={[
              { value: "all", label: "Todos" },
              { value: "unpaid", label: "unpaid" },
              { value: "paid", label: "paid" },
              { value: "refund", label: "refund" },
            ]}
            value={paymentStatus}
            onChange={setPaymentStatus}
            placeholder="Estado de pago"
          />
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
        <div className="flex items-center">
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
                <th className="text-left py-2 px-1"># Booking</th>
                {/* <th className="text-left p-2">Fecha</th> */}
                <th className="text-left py-2 px-1">Cliente</th>
                <th className="text-left py-2 px-1">Total</th>
                <th className="text-left py-2 px-1">Pago</th>
                <th className="text-left py-2 px-1 hidden sm:table-cell">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const bgColor = STATUS_COLORS[b.status] || "bg-white";
                return (
                  <React.Fragment key={b._id}>
                    <tr className={`${bgColor} border-b`}>
                      <td className=" py-2 px-1 flex gap-2  items-center">
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
                      {/* <td className="py-2 px-1">
                        {
                          formatearFechaCortaDesdeISO(
                            b.startTime?.isoTime,
                            language,
                            "br"
                          ).formatedDateShort
                        }
                      </td> */}
                      <td className="py-2 px-1">{b.clientData.name}</td>
                      <td className="py-2 px-1 min-w-[60px]">
                        {formatPrice(b.price.grossAmount, b.currency)}
                      </td>
                      <td className="py-2 px-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {b.paymentStatus || "unpaid"}
                        </span>
                      </td>
                      <td className="py-2 px-1 hidden sm:table-cell">
                        <span className="text-xs font-semibold text-gray-700">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                    {openRow === b._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="p-4 text-sm">
                          <p className="text-lg font-bold underline mb-3">
                            Datos Cliente
                          </p>
                          <p>
                            <strong>Nombre Cliente:</strong>{" "}
                            {typeof b.clientData?.name === "string"
                              ? b.clientData.name
                              : ""}
                          </p>
                          <p>
                            <strong>Email Cliente:</strong>{" "}
                            {typeof b.clientData?.email === "string"
                              ? b.clientData.email
                              : ""}
                          </p>
                          <p>
                            <strong>Teléfono Cliente:</strong>{" "}
                            {typeof b.clientData?.phone === "string"
                              ? "(" +
                                b.clientData.phoneCode +
                                ") " +
                                b.clientData.phone
                              : ""}
                          </p>

                          <p className="mb-6" />

                          <p className="text-lg font-bold underline mb-3">
                            Datos Reserva
                          </p>

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
                          <p>
                            <strong>Fecha del servicio:</strong>{" "}
                            {typeof b?.startTime.isoTime === "string"
                              ? formatearFechaCortaDesdeISO(
                                  b.startTime.isoTime,
                                  language,
                                  "br"
                                ).formatedDateShort
                              : ""}
                          </p>
                          <p>
                            <strong>Hora del servicio:</strong>{" "}
                            {typeof b?.startTime.isoTime === "string"
                              ? formatearFechaCortaDesdeISO(
                                  b.startTime.isoTime,
                                  language,
                                  "br"
                                ).formatedTime
                              : ""}
                          </p>
                          <p className="flex items-center gap-2">
                            <strong>Estado:</strong>{" "}
                            <div className="uppercase">
                              {typeof b.status === "string"
                                ? b.status
                                : b.status}
                            </div>
                          </p>
                          <p>
                            <strong>Creación de la reserva:</strong>{" "}
                            {typeof b.createdAt === "string"
                              ? formatearFechaCortaDesdeISO(
                                  b.createdAt,
                                  language,
                                  "br"
                                ).formatedDateShort
                              : ""}
                          </p>

                          <div className="my-3 max-w-md">
                            <TablePriceSummary
                              status={b?.paymentStatus || "unpaid"}
                              price={b?.price || {}}
                            />
                          </div>
                          {b.paymentStatus === "unpaid" &&
                            !canCapturePayment(b).canCapture && (
                              <div className="text-md bg-yellow-50 max-w-md border border-black r text-gray-700">
                                * Se podra capturar el pago el{" "}
                                {canCapturePayment(b).dataCapture.formatedDate}{" "}
                                a las{" "}
                                {canCapturePayment(b).dataCapture.formatedTime}{" "}
                                {" hrs "}
                              </div>
                            )}

                          {/* BOTONES CONTEXTUALES */}
                          <div className="flex flex-wrap gap-3 mt-4">
                            {b.status === "requested" && (
                              <>
                                <button
                                  className="bg-green-600 text-white px-4 py-1 rounded"
                                  onClick={() => handleOpenModal(b, "confirm")}
                                >
                                  Confirmar Reserva
                                </button>
                                <button
                                  className="bg-red-600 text-white px-4 py-1 rounded"
                                  onClick={() => handleOpenModal(b, "cancel")}
                                >
                                  Cancelar Reserva
                                </button>
                              </>
                            )}
                            {(b.status != "confirmed" ||
                              b.status != "completed") &&
                              b.paymentStatus === "unpaid" &&
                              canCapturePayment(b).canCapture && (
                                <>
                                  <button
                                    className="bg-blue-600 text-white px-4 py-1 rounded"
                                    onClick={() =>
                                      handleOpenModal(b, "capturePayment")
                                    }
                                  >
                                    Capturar pago
                                  </button>
                                </>
                              )}
                            {b.paymentStatus === "paid" && (
                              <button
                                className="bg-yellow-600 text-white px-4 py-1 rounded"
                                onClick={() => handleOpenModal(b, "refund")}
                              >
                                Reembolsar total (
                                {formatPrice(b?.price?.netAmount, b?.currency)})
                              </button>
                            )}
                            {b.paymentStatus === "unpaid" && (
                              <button
                                className="bg-red-600 text-white px-4 py-1 rounded"
                                onClick={() =>
                                  handleOpenModal(b, "cancelWithNoPayment")
                                }
                              >
                                Cancelar
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
        onConfirm={handleConfirmModal}
        message={getModalMessage()}
        variant={modalData?.action || "default"}
      />
    </div>
  );
}
