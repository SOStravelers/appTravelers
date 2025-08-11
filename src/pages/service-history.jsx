import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import { useStore } from "@/store";
import { getUserTimeData } from "@/lib/time/index.js";
import BookingService from "@/services/BookingService";
import { Rings } from "react-loader-spinner";

/* =========================
   Helpers de tiempo
   ========================= */

/** Toma la TZ del booking; fallback a UTC si no hay nada. */
function getBookingTimeZone(b) {
  return (
    b?.countryData?.timeZone ||
    b?.startTime?.timeZone ||
    b?.timeZone ||
    b?.subservice?.timeZone ||
    b?.service?.timeZone ||
    "UTC"
  );
}

/** Devuelve 'YYYY-MM' calculado en la TZ del booking. */
function getYYYYMMInTZ(iso, timeZone) {
  const dt = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    timeZone,
  });
  const parts = fmt.formatToParts(dt);
  const year = parts.find((p) => p.type === "year")?.value || "0000";
  const month = parts.find((p) => p.type === "month")?.value || "01";
  return `${year}-${month}`;
}

/** Label “MMMM YYYY” seguro (día 15 a las 12:00 UTC para no retroceder de mes). */
function monthLabelFromKey(yyyyMM, locale) {
  const safeMidMonth = new Date(`${yyyyMM}-15T12:00:00Z`);
  const fmt = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC", // da igual la TZ al usar día 15 12:00Z
  });
  const label = fmt.format(safeMidMonth);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function ServiceHistoryPage() {
  const router = useRouter();
  const { language } = useStore();

  const [items, setItems] = useState([]); // lista acumulada
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const sentinelRef = useRef(null);
  const lastRequestedPageRef = useRef(0); // evita pedir dos veces la misma página
  const idSetRef = useRef(new Set()); // de-dup por _id

  // reset cuando cambia el idioma (solo re-renderiza labels)
  useEffect(() => {
    setItems([]);
    idSetRef.current = new Set();
    setPage(1);
    lastRequestedPageRef.current = 0;
    setHasMore(true);
    setErr(null);
  }, [language]);

  const fetchPage = useCallback(
    async (targetPage) => {
      if (loading || !hasMore) return;
      if (lastRequestedPageRef.current === targetPage) return; // evita duplicado
      lastRequestedPageRef.current = targetPage;

      setLoading(true);
      setErr(null);
      try {
        const { isoTime, timeZone, locale } = getUserTimeData(language);
        const res = await BookingService.getHistory({
          isoTime,
          timeZone,
          language,
          locale,
          page: targetPage,
          limit,
        });
        const data = Array.isArray(res?.data) ? res.data : [];

        // de-dup por _id
        const next = [];
        for (const b of data) {
          if (!idSetRef.current.has(b._id)) {
            idSetRef.current.add(b._id);
            next.push(b);
          }
        }

        setItems((prev) => [...prev, ...next]);
        if (data.length < limit) setHasMore(false);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    },
    [language, hasMore, loading]
  );

  // pide la página actual
  useEffect(() => {
    if (!hasMore) return;
    fetchPage(page);
  }, [page, fetchPage, hasMore]);

  // IntersectionObserver para pedir la siguiente página
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  // Agrupar por mes según la TZ de CADA booking
  const { locale } = getUserTimeData(language);
  const grouped = useMemo(() => {
    const g = {};
    for (const b of items) {
      const tz = getBookingTimeZone(b);
      const key = getYYYYMMInTZ(b?.startTime?.isoTime, tz);
      (g[key] ||= []).push(b);
    }
    return g;
  }, [items]);

  // Orden de meses: descendente
  const monthKeys = useMemo(
    () => Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1)),
    [grouped]
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-textColor mb-4">
        {language === "es" && "Historial de reservas"}
        {language === "en" && "Booking History"}
        {language === "pt" && "Histórico de reservas"}
        {language === "fr" && "Historique des réservations"}
        {language === "de" && "Buchungsverlauf"}
      </h1>

      {monthKeys.map((k) => {
        const title = monthLabelFromKey(k, locale);
        // Orden interno del mes: más recientes primero (por fecha real del booking)
        const list = [...grouped[k]].sort(
          (a, b) =>
            new Date(b.startTime.isoTime).getTime() -
            new Date(a.startTime.isoTime).getTime()
        );
        return (
          <section key={k} className="mb-8">
            <h2 className="text-lg font-semibold text-textColor mb-3 capitalize">
              {title}
            </h2>
            <div className="flex flex-col gap-3">
              {list.map((booking) => (
                <EventCard
                  key={booking._id}
                  {...booking}
                  fullWidth={true}
                  isClosed={false}
                  onClick={() => router.push(`/my-booking/${booking._id}`)}
                  details={true}
                />
              ))}
            </div>
          </section>
        );
      })}

      {loading && (
        <div className="flex justify-center my-6">
          <Rings width={72} height={72} color="#00A0D5" ariaLabel="loading" />
        </div>
      )}

      {!loading && items.length === 0 && !err && (
        <p className="text-center text-textColorGray my-10">
          {language === "es" && "No hay reservas en tu historial."}
          {language === "en" && "No bookings in your history."}
          {language === "pt" && "Não há reservas no seu histórico."}
          {language === "fr" && "Aucune réservation dans votre historique."}
          {language === "de" && "Keine Buchungen in deinem Verlauf."}
        </p>
      )}

      {err && (
        <p className="text-center text-red-500 my-6">
          {language === "es" && "Ocurrió un error al cargar el historial."}
          {language === "en" && "An error occurred while loading history."}
          {language === "pt" && "Ocorreu um erro ao carregar o histórico."}
          {language === "fr" && "Une erreur s'est produite lors du chargement."}
          {language === "de" && "Beim Laden ist ein Fehler aufgetreten."}
        </p>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-10" />

      {!hasMore && items.length > 0 && (
        <p className="text-center text-textColorGray my-8">
          {language === "es" && "Has llegado al final del historial."}
          {language === "en" && "You reached the end of history."}
          {language === "pt" && "Você chegou ao fim do histórico."}
          {language === "fr" && "Vous avez atteint la fin de l'historique."}
          {language === "de" && "Du hast das Ende der Historie erreicht."}
        </p>
      )}
    </div>
  );
}
