import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import EventCard from "@/components/utils/cards/EventCard";
import { useStore } from "@/store";
import { getUserTimeData } from "@/lib/time/index.js";
import BookingService from "@/services/BookingService";
import { Rings } from "react-loader-spinner";

/** Obtiene {year, month} respetando locale/timeZone */
function getYearMonthParts(iso, locale, timeZone) {
  const dt = new Date(iso);
  const fmt = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    timeZone,
  });
  const parts = fmt.formatToParts(dt);
  const year = parts.find((p) => p.type === "year")?.value || "0000";
  const month = parts.find((p) => p.type === "month")?.value || "01";
  return { year, month };
}

/** Label “MMMM YYYY” según locale/timeZone */
function getMonthLabel(yyyyMM, locale, timeZone) {
  const date = new Date(`${yyyyMM}-01T00:00:00Z`);
  const fmt = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone,
  });
  const label = fmt.format(date);
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

  // reset cuando cambia el idioma
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

  // Agrupar por mes (según zona/locale del usuario)
  const { locale, timeZone } = getUserTimeData(language);
  const grouped = useMemo(() => {
    const g = {};
    for (const b of items) {
      const { year, month } = getYearMonthParts(
        b.startTime.isoTime,
        locale,
        timeZone
      );
      const key = `${year}-${month}`; // YYYY-MM
      (g[key] ||= []).push(b);
    }
    return g;
  }, [items, locale, timeZone]);

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
        const title = getMonthLabel(k, locale, timeZone);
        // Orden interno del mes: más recientes primero
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
