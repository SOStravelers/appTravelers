// components/service/ServiceList.jsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import SubserviceService from "@/services/SubserviceService";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import { useStore } from "@/store";

const ITEMS_PER_LOAD = 2;

export default function ServiceList({ filterKey }) {
  const router = useRouter();
  const user = Cookies.get("auth.user_id");

  /* ----------  Estado global (zustand) ---------- */
  const {
    listItems,
    listPage,
    listHasNext,
    setListItems,
    appendListItems,
    setListPage,
    setListHasNext,
    /* NUEVO:  */
    homeScrollY,
    setScrollY, // ⬅️  NUEVO nombre
    setRestoreScroll,
    restoreScroll,
    setLastPage,
    lastPage,
  } = useStore((s) => ({
    listItems: s.listItems,
    listPage: s.listPage,
    listHasNext: s.listHasNext,
    setListItems: s.setListItems,
    appendListItems: s.appendListItems,
    setListPage: s.setListPage,
    setListHasNext: s.setListHasNext,
    homeScrollY: s.homeScrollY,
    setScrollY: s.setScrollY,
    setRestoreScroll: s.setRestoreScroll,
    restoreScroll: s.restoreScroll,
    setLastPage: s.setLastPage,
    lastPage: s.lastPage,
  }));

  /* ----------  Estado local ---------- */
  const [loading, setLoading] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const loadMoreRef = useRef(null);

  /* ----------  1) Carga inicial (sólo si aún no hay data) ---------- */
  useEffect(() => {
    console.log("vamos a cargar la data,", lastPage);
    if (listItems.length === 0 && lastPage != "index") loadPage(1);
  }, []); // ← se ejecuta 1-vez

  /* ----------  2) Función para pedir una página ---------- */
  const loadPage = useCallback(
    async (page) => {
      setLoading(true);
      const res = await SubserviceService.getAll({
        page,
        limit: ITEMS_PER_LOAD,
        filter: filterKey,
      });
      const { docs, hasNextPage } = res.data;
      if (page === 1) setListItems(docs);
      else appendListItems(docs);
      setListHasNext(hasNextPage);
      setListPage(page);
      setLoading(false);
    },
    [filterKey]
  );

  /* ----------  3) Infinite scroll ---------- */
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !listHasNext) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        console.log("activa segundo caso", lastPage);
        if (e.isIntersecting && !loading && lastPage != "index") {
          console.log("entra aqui", lastPage);
          loadPage(listPage + 1);
        }
        setLastPage("");
      },
      { rootMargin: "200px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [listHasNext, listPage, loading]);

  /* ----------  4) Reiniciar cuando cambia el filtro ---------- */
  useEffect(() => {
    console.log("wena");
    setListItems([]);
    setListHasNext(true);
    loadPage(1);
  }, [filterKey]);

  /* ----------  6) Guardar scroll y navegar ---------- */
  const handleNavigate = (id) => {
    console.log("altura list", window.scrollY);
    setScrollY(window.scrollY);
    Cookies.set("homeScrollY", window.scrollY);
    setRestoreScroll(true);
    setLastPage("index");
    router.push(`/service-preview/${id}`, undefined, { scroll: false });
  };

  /* ----------  7) Like ---------- */
  const likeButton = () => {
    if (!user) {
      setOpenLogin(true);
      return false;
    }
    return true;
  };

  /* ----------  8) Render ---------- */
  return (
    <div className="flex flex-col items-center w-full">
      {listItems.length === 0 && loading ? (
        /* skeleton inicial */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse">
          {Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {listItems.map((svc, i) => (
              <div key={svc._id} className="w-full">
                <ServiceCardRecomendation
                  service={svc}
                  index={i}
                  onClick={() => handleNavigate(svc._id)}
                  onlikeButton={likeButton}
                />
              </div>
            ))}
          </div>
          {listHasNext && <div ref={loadMoreRef} className="h-2 w-full" />}
        </>
      )}

      {!user && (
        <LoginFormModal
          open={openLogin}
          setOpen={setOpenLogin}
          title="Login to continue"
        />
      )}
    </div>
  );
}
