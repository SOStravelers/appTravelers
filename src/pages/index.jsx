import { useEffect, useState, useLayoutEffect } from "react";
import clsx from "clsx";
import IconCarousel from "@/components/utils/carousels/IconsCarousel";
import NotificationService from "@/services/NotificationService";
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
    setHaveNotification,
    setService,
    language,
    lastPage,
    setLastPage,
    listItems,
  } = store;
  const [scrolled, setScrolled] = useState(false);

  const userId = Cookies.get("auth.user_id");

  useEffect(() => {
    document.title = "Home | SOS Travelers";
    if (userId) checkNotification();
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("✅ timer disparado – setLastPage");

      setLastPage("");
    }, 500);

    // Se ejecuta al desmontar el componente o al recrearse el efecto
    return () => clearTimeout(timerId);
  }, []);

  // useLayoutEffect(() => {
  //   if (lastPage !== "preview") {
  //     setScrolled(true);
  //     return;
  //   }

  //   // valor guardado
  //   const ySaved = Number(Cookies.get("homeScrollY") || 0);

  //   // Espera a que la página haya pintado el IconCarousel
  //   requestAnimationFrame(() => {
  //     requestAnimationFrame(() => {
  //       const sticky = document.getElementById("icon-carousel");

  //       // alto de la barra fija + alto real del carrusel cuando se hace sticky
  //       const TOPBAR = 52;
  //       const offset = TOPBAR + (sticky ? sticky.offsetHeight : 0);
  //       //minicambio
  //       window.scrollTo(0, Math.max(0, ySaved - 700));
  //       setScrolled(true);
  //       setLastPage("");
  //     });
  //   });
  // }, []);

  useEffect(() => {
    const id = Cookies.get("homeItemId");
    if (!id) return;

    // /** espera a que la lista exista en el DOM */
    const tryScroll = () => {
      const el = document.querySelector(`[data-item-id='${id}']`);
      if (!el) {
        requestAnimationFrame(tryScroll);
        return;
      }
      console.log("entro aqui", `[data-item-id='${id}']`);
      // el.scrollIntoView({ behavior: "smooth", block: "center" });

      const topBar = 70;
      const nav = document.getElementById("icon-carousel")?.offsetHeight ?? 0;
      const y =
        el.getBoundingClientRect().top + window.scrollY - (topBar + nav);

      window.scrollTo({ top: y });
      Cookies.remove("homeItemId"); // úsalo solo una vez
    };

    // const tryScroll = () => {
    //   const el = document.querySelector(`[data-item-id='${id}']`);
    //   if (!el) {
    //     requestAnimationFrame(tryScroll);
    //     return;
    //   }

    //   /* alto fijo de top-bar (52 px) + alto real del IconCarousel */
    //   const topBar = 52;
    //   const nav = document.getElementById("icon-carousel")?.offsetHeight ?? 0;

    //   const y =
    //     el.getBoundingClientRect().top + window.scrollY - (topBar + nav);

    //   window.scrollTo({ top: y, behavior: "instant" });
    //   Cookies.remove("homeItemId");
    // };
    requestAnimationFrame(tryScroll);
  }, [listItems.length]);

  useEffect(() => {
    // Si NO venimos de preview, habilita la vista enseguida
    if (lastPage !== "preview") {
      setScrolled(true);
    }
  }, [lastPage]);

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
      <section id="icon-carousel" className="sticky top-[52px] z-20 bg-white">
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
