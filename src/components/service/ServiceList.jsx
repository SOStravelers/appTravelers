// components/service/ServiceList.jsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { NotFoundPicture } from "@/constants/icons";
import SubserviceService from "@/services/SubserviceService";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import { useStore } from "@/store";
import FavoriteService from "@/services/FavoriteService";
const ITEMS_PER_LOAD = 15;

export default function ServiceList({ filterKey }) {
  const router = useRouter();
  const user = Cookies.get("auth.user_id");

  const {
    listItems,
    listPage,
    listHasNext,
    setListItems,
    appendListItems,
    setListPage,
    setListHasNext,
    lastPage,
    setLastPage,
    loggedIn,
    filters,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [previousPage, setPreviousPage] = useState(0);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const safeItems = Array.isArray(listItems) ? listItems : [];
  const [notRepeated, setNotRepeated] = useState(false);
  const [liked, setLiked] = useState(false);

  const loadPage = useCallback(
    async (page) => {
      console.log("check", lastPage);
      if (loading || (lastPage === "preview" && page === 1)) return;

      setPreviousPage(page);
      setLoading(true);
      page == 1 ? setNotRepeated(true) : setNotRepeated(false);

      try {
        const res = await SubserviceService.getAll({
          page,
          limit: ITEMS_PER_LOAD,
          filter: filters,
        });

        const { docs, hasNextPage } = res.data;
        if (page === 1) {
          // Reemplazo total sin validar duplicados
          setListItems(docs);
        } else {
          // Evitar duplicados si es append
          const currentIds = new Set(
            Array.isArray(listItems) ? listItems.map((item) => item._id) : []
          );
          const newDocs = docs.filter((doc) => !currentIds.has(doc._id));
          if (newDocs.length > 0) {
            appendListItems(newDocs);
          }
        }

        setListPage(page);
        setListHasNext(hasNextPage);
      } catch (err) {
        console.error("Error loading page", err);
      } finally {
        setLoading(false);
      }
    },
    [
      filters,
      lastPage,
      loading,
      setListItems,
      appendListItems,
      setListPage,
      setListHasNext,
      listItems,
      previousPage,
    ]
  );

  useEffect(() => {
    console.log("inicio");
    if (safeItems.length === 0 && lastPage !== "preview") {
      // window.scrollTo({ top: 0, behavior: "auto" });
      loadPage(1);
    }
  }, []);

  useEffect(() => {
    console.log("activa", sentinelRef.current);
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && listHasNext && !loading) {
          console.log("📦 Scroll detectado: cargando más...");
          loadPage(listPage + 1);
        }
      },
      { rootMargin: "300px" } // ← mayor margen mejora el trigger anticipado
    );

    observer.observe(sentinel);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [listItems, listHasNext, listPage, loading, loadPage]);

  useEffect(() => {
    console.log("filteres");
    if (lastPage !== "preview") {
      // requestedPages.current.clear();
      // setListItems([]);
      // window.scrollTo({ top: 0, behavior: "auto" });
      loadPage(1);
      setListHasNext(true);
    }
  }, [filterKey]);

  useEffect(() => {
    setLiked(false);
  }, [liked]);

  const handleNavigate = (id) => {
    Cookies.set("homeItemId", id);
    setLastPage("preview");
    router.push(`/service-preview/${id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center w-full">
        {loading && notRepeated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 pointer-events-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blueBorder border-solid" />
          </div>
        )}
        {safeItems.length === 0 && !loading ? (
          <div className="text-center text-sm text-gray-500 py-15 mt-5">
            <p className="text-md font-medium text-textColor">
              No services found
            </p>
            <p className="text-sm text-textColor">
              Try adjusting your filters or come back later.
            </p>
            <div
              className="mx-auto w-[170px] max-w-xs"
              style={{ marginTop: "-40px" }}
            >
              <NotFoundPicture />
            </div>
          </div>
        ) : safeItems.length === 0 && loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full animate-pulse">
            {Array.from({ length: ITEMS_PER_LOAD }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-md" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full">
              {safeItems.map((svc, i) => (
                <div key={svc._id} data-item-id={svc._id} className="w-full">
                  <ServiceCardRecomendation
                    service={svc}
                    index={i}
                    onClick={() => handleNavigate(svc._id)}
                    openLoginModal={() => setOpenLogin(true)}
                  />
                </div>
              ))}
            </div>
            {<div ref={sentinelRef} className="h-2 w-full" />}
          </>
        )}
      </div>
      {!loggedIn && (
        <LoginFormModal
          open={openLogin}
          setOpen={setOpenLogin}
          title="Login to continue"
        />
      )}
    </>
  );
}
