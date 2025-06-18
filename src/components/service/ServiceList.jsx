import React, { useState, useEffect, useRef } from "react";
import ServiceCard from "./SubServiceCard";
import SubserviceService from "@/services/SubserviceService";

const ITEMS_PER_LOAD = 2;

const ServiceList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const loadMoreRef = useRef(null);

  // Carga una página y concatena resultados
  const loadPage = (p) => {
    SubserviceService.getAll({ page: p, limit: ITEMS_PER_LOAD })
      .then((res) => {
        const { docs, hasNextPage } = res.data;
        setItems((prev) => [...prev, ...docs]);
        setHasNext(hasNextPage);
      })
      .catch(console.error);
  };

  // Al montar y cada vez que cambie `page`, pedir esa página
  useEffect(() => {
    loadPage(page);
  }, [page]);

  // Observer para scroll infinito
  useEffect(() => {
    if (!loadMoreRef.current || !hasNext) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNext]);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-semibold mb-6">All experiences</h2>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 w-full ">
          {items.map((service) => (
            <div key={service._id} className="w-full">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-10">No services available.</p>
      )}

      {/* Sentinel: dispara cargar siguiente página al hacerse visible */}
      {hasNext && <div ref={loadMoreRef} className="h-2 w-full" />}
    </div>
  );
};

export default ServiceList;
