import { useEffect, useState } from "react";
import clsx from "clsx";
import IconCarousel from "@/components/utils/carousels/IconsCarousel";
import NotificationService from "@/services/NotificationService";
import FloatingWhatsAppButton from "../components/utils/buttons/FloatingWhatsAppButton";
import Cookies from "js-cookie";
import LoaderGlobal from "@/components/layout/loaderGlobal";
import { useStore } from "@/store";
import SyncCarousel from "@/components/utils/carousels/SyncCarousel";
import ServiceList from "@/components/service/ServiceList";
import FilterModal from "@/components/utils/modal/FilterModal";

export default function Home() {
  const store = useStore();
  const {
    setHaveNotification,
    setService,
    language,
    lastPage,
    setLastPage,
    listItems,
    stickypoint,
    setStickypoint,
    loadingCarrouselVideos,
  } = store;
  const [scrolled, setScrolled] = useState(true);
  const [filterKey, setFilterKey] = useState(0);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [obsFilter, setObsFilter] = useState(true);
  const userId = Cookies.get("auth.user_id");

  const handleFilterChange = () => {
    setFilterKey((k) => k + 1);
    setObsFilter(true);
  };
  //minicambio

  useEffect(() => {
    document.title = "Home | SOS Travelers";
    if (userId) checkNotification();
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);
  useEffect(() => {
    const timerIds = setTimeout(() => {
      console.log("activo");
      setLastPage("");
      if (stickypoint == 0) {
        const stickyEl = document.getElementById("icon-carousel");
        // const point = stickyEl.getBoundingClientRect().top - 52;
        const point = window.innerHeight * 0.8 - 52;
        console.log("el point", point);
        setStickypoint(point);
      }
    }, 100);
    return () => clearTimeout(timerIds);
  }, [stickypoint]);

  useEffect(() => {
    if (lastPage !== "preview" && obsFilter) {
      setScrolled(true);
      setObsFilter(false);
      requestAnimationFrame(() => {
        setTimeout(() => {
          const stickyEl = document.getElementById("icon-carousel");
          if (!stickyEl) return;
          if (window.scrollY >= stickypoint) {
            window.scrollTo({ top: stickypoint });
          } else {
            window.scrollTo({ top: stickypoint, behavior: "smooth" });
          }
        }, 50);
      });
    } else {
      console.log("cva aqui");
      const id = Cookies.get("homeItemId");
      console.log("id", id);
      if (!id) return;
      const tryScroll = () => {
        const el = document.querySelector(`[data-item-id='${id}']`);
        if (!el) {
          requestAnimationFrame(tryScroll);
          return;
        }
        const topBar = 70;
        const nav = document.getElementById("icon-carousel")?.offsetHeight ?? 0;
        const y =
          el.getBoundingClientRect().top + window.scrollY - (topBar + nav);
        window.scrollTo({ top: y });
        Cookies.remove("homeItemId");
      };

      requestAnimationFrame(tryScroll);
    }
  }, [listItems.length, filterKey]);

  const checkNotification = async () => {
    try {
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
    } catch {}
  };

  return (
    <>
      {!(scrolled && loadingCarrouselVideos) && (
        <div className="min-h-screen flex items-center justify-center bg-backgroundP">
          <div className="w-10 h-10 border-4 border-t-transparent border-textColor rounded-full animate-spin"></div>
        </div>
      )}
      <main
        className={clsx(
          "flex flex-col w-full bg-backgroundP md:pl-[240px] pb-[100px] overflow-x-visible",
          scrolled && loadingCarrouselVideos
            ? "opacity-100 transition-opacity duration-300"
            : "opacity-0 pointer-events-none"
        )}
      >
        <SyncCarousel />

        <section id="icon-carousel" className="sticky top-[52px] z-20 ">
          <IconCarousel
            onFilterChange={handleFilterChange}
            onOpenFilter={() => setFilterOpen(true)}
          />
        </section>

        <section className="p-4">
          <ServiceList filterKey={filterKey} />
        </section>

        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setFilterOpen(false)}
          onApply={handleFilterChange}
        />

        <FloatingWhatsAppButton />
      </main>
    </>
  );
}
