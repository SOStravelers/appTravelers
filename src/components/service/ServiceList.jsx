// ServiceList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ServiceCard from "./SubServiceCard";
import SubserviceService from "@/services/SubserviceService";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
const ITEMS_PER_LOAD = 2;

const ServiceList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const loadMoreRef = useRef(null);
  const router = useRouter();

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

  // Cada vez que cambie `page`, pedimos esa página
  useEffect(() => {
    loadPage(page);
  }, [page]);

  // IntersectionObserver para scroll infinito
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
      {/* <h2 className="text-2xl font-semibold mb-6">All experiences</h2> */}

      {items.length > 0 ? (
        <div
          className="
            grid 
              grid-cols-1       /* 1 columna en móvil */
              sm:grid-cols-2    /* 2 cols desde ≥640px */
              md:grid-cols-3    /* 3 cols desde ≥768px */
              lg:grid-cols-4    /* 4 cols desde ≥1024px */
            gap-6 w-full
          "
        >
          {items.map((service, index) => (
            <div key={service._id} className="w-full">
              {/* <ServiceCard service={service} /> */}

              <ServiceCardRecomendation
                onClick={() => router.push(`/service-preview/${service._id}`)}
                key={service._id}
                service={service}
                index={index}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-10">No services available.</p>
      )}

      {/* Sentinel: cuando aparece, cargamos siguiente página */}
      {hasNext && <div ref={loadMoreRef} className="h-2 w-full" />}
    </div>
  );
};

export default ServiceList;
