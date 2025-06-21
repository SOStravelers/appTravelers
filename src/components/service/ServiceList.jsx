// ServiceList.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
import SubserviceService from "@/services/SubserviceService";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
const ITEMS_PER_LOAD = 2;
import { useStore } from "@/store";
export default function ServiceList({ filterKey }) {
  const store = useStore();
  const { loginModal, setLoginModal, setService, language } = store;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const loadMoreRef = useRef(null);
  const router = useRouter();
  var user = Cookies.get("auth.user_id");
  // Fetch a page, passing filterKey, manage loading state
  const loadPage = useCallback(
    async (p) => {
      setLoading(true);
      // Añadimos un delay de 500ms para que se aprecie el estado de "cargando"
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const res = await SubserviceService.getAll({
          page: p,
          limit: ITEMS_PER_LOAD,
          filter: filterKey,
        });
        const { docs, hasNextPage } = res.data;
        setItems((prev) => (p === 1 ? docs : [...prev, ...docs]));
        setHasNext(hasNextPage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filterKey]
  );

  // when page or filterKey changes, load that page
  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  // when filterKey changes, reset items and page
  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const likeButton = (state, id) => {
    console.log("entro");
    if (!user) {
      setOpen(true);
      return false;
    } else {
      console.log("a guardar like", state, id);
      return true;
    }
  };

  // infinite scroll sentinel
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNext) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNext, loading]);

  // render skeleton placeholders
  {
    loading && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse">
        {Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {items.map((service, index) => (
            <div key={service._id} className="w-full">
              <ServiceCardRecomendation
                onClick={() => router.push(`/service-preview/${service._id}`)}
                onlikeButton={likeButton}
                service={service}
                index={index}
              />
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center py-10">No services available.</p>
      )}
      {hasNext && <div ref={loadMoreRef} className="h-2 w-full" />}

      {!user && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
