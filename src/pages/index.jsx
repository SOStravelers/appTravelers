import { useEffect, useState, useLayoutEffect } from "react";
import clsx from "clsx";
import IconCarousel from "@/components/utils/carousels/IconsCarousel";
import NotificationService from "@/services/NotificationService";
import ServiceService from "@/services/ServiceService";
import FloatingWhatsAppButton from "../components/utils/buttons/FloatingWhatsAppButton";
import Cookies from "js-cookie";
import { NotFoundPicture } from "@/constants/icons";
import { useStore } from "@/store";
import SyncCarousel from "@/components/utils/carousels/SyncCarousel";
import ServiceList from "@/components/service/ServiceList";
import FilterModal from "@/components/utils/modal/FilterModal";

export default function Home({}) {
  const store = useStore();
  const {
    services,
    setServices,
    setHaveNotification,
    setService,
    language,
    lastPage,
    setLastPage,
  } = store;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("✅ timer disparado – eliminando cookie");
      Cookies.remove("homeScrollY");

      setLastPage("");
    }, 2500);

    // Se ejecuta al desmontar el componente o al recrearse el efecto
    return () => clearTimeout(timerId);
  }, []);

  useLayoutEffect(() => {
    if (lastPage !== "preview") {
      setScrolled(true);
      return;
    }

    // valor guardado
    const ySaved = Number(Cookies.get("homeScrollY") || 0);

    // Espera a que la página haya pintado el IconCarousel
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const sticky = document.getElementById("icon-carousel");

        // alto de la barra fija + alto real del carrusel cuando se hace sticky
        const TOPBAR = 52;
        const offset = TOPBAR + (sticky ? sticky.offsetHeight : 0);

        window.scrollTo(0, Math.max(0, ySaved - 700));
        setScrolled(true);
        setLastPage("");
      });
    });
  }, []);

  const userId = Cookies.get("auth.user_id");

  useEffect(() => {
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    document.title = "Home | SOS Travelers";
    if (userId) checkNotification();
    if (!services || Object.keys(services).length === 0) getData();
  }, []);

  const getData = async () => {
    const response = await ServiceService.list({ isActive: true, page: 1 });
    setServices(response.data.docs);
  };

  const checkNotification = async () => {
    try {
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
    } catch {}
  };

  // contador para forzar remount
  const [filterKey, setFilterKey] = useState(0);
  // control del modal
  const [isFilterOpen, setFilterOpen] = useState(false);

  const handleFilterChange = () => {
    setFilterKey((k) => k + 1);
  };

  return (
    <main
      className={clsx(
        "flex flex-col w-full bg-white md:pl-[240px] pb-[100px] overflow-x-visible",
        scrolled
          ? "opacity-100 transition-opacity duration-300"
          : "opacity-0 pointer-events-none"
      )}
    >
      <SyncCarousel />

      {/* Aquí aplicamos sticky */}
      <section className="sticky top-[52px] z-20 bg-white">
        <IconCarousel
          onFilterChange={handleFilterChange}
          onOpenFilter={() => setFilterOpen(true)}
        />
      </section>

      <section className="p-4">
        <ServiceList filterKey={filterKey} />
      </section>

      {/* nuestro modal separado */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterChange}
      />

      <FloatingWhatsAppButton />

      {process.env.NEXT_PUBLIC_NODE_ENV !== "productionsss" ? (
        <></>
      ) : (
        <div className="flex flex-col justify-center max-w-lg items-center">
          <NotFoundPicture />
          <h1 className="mt-10 text-center">
            We are hard at work to get back into action
          </h1>
        </div>
      )}
    </main>
  );
}
