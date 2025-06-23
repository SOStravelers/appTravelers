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
    filters,
  } = useStore((s) => ({
    listItems: s.listItems,
    listPage: s.listPage,
    listHasNext: s.listHasNext,
    setListItems: s.setListItems,
    appendListItems: s.appendListItems,
    setListPage: s.setListPage,
    setListHasNext: s.setListHasNext,
    setLastPage: s.setLastPage,
    lastPage: s.lastPage,
    filters: s.filters,
  }));

  const [loading, setLoading] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [previousPage, setPreviousPage] = useState(0);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const safeItems = Array.isArray(listItems) ? listItems : [];
  const requestedPages = useRef(new Set());

  const loadPage = useCallback(
    async (page) => {
      if (loading || (lastPage === "preview" && page === 1)) return;

      setPreviousPage(page);
      setLoading(true);

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
    if (safeItems.length === 0 && lastPage !== "preview") {
      // window.scrollTo({ top: 0, behavior: "auto" });
      loadPage(1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && listHasNext && !loading) {
          loadPage(listPage + 1);
        }
      },
      { rootMargin: "50px" }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
      observerRef.current = observer;
    }

    return () => observer.disconnect();
  }, [listHasNext, listPage, loading, loadPage]);

  useEffect(() => {
    if (lastPage !== "preview") {
      // requestedPages.current.clear();
      // setListItems([]);
      setListHasNext(true);
      // window.scrollTo({ top: 0, behavior: "auto" });
      loadPage(1);
    }
  }, [filterKey]);

  const handleNavigate = (id) => {
    Cookies.set("homeItemId", id);
    setLastPage("preview");
    router.push(`/service-preview/${id}`, undefined, { scroll: false });
  };

  const likeButton = () => {
    if (!user) {
      setOpenLogin(true);
      return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {safeItems.length === 0 && !loading ? (
        <div className="text-center text-sm text-gray-500 py-10">
          <p className="text-lg font-medium">No services found</p>
          <p className="text-sm">
            Try adjusting your filters or come back later.
          </p>
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
                  onlikeButton={likeButton}
                />
              </div>
            ))}
          </div>
          {listHasNext && <div ref={sentinelRef} className="h-2 w-full" />}
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
