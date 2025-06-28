import { useEffect, useState } from "react";
import clsx from "clsx";
import delay from "@/utils/delayFunction";
import IconCarousel from "@/components/utils/carousels/IconsCarousel";
import NotificationService from "@/services/NotificationService";
import FloatingWhatsAppButton from "../components/utils/buttons/FloatingWhatsAppButton";
import Cookies from "js-cookie";
import { NotFoundPicture } from "@/constants/icons";
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
  } = store;
  const [scrolled, setScrolled] = useState(false);
  const [filterKey, setFilterKey] = useState(0);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [obsFilter, setObsFilter] = useState(false);

  const userId = Cookies.get("auth.user_id");

  const handleFilterChange = () => {
    setFilterKey((k) => k + 1);
    setObsFilter(true);
  };

  useEffect(() => {
    document.title = "Home | SOS Travelers";
    if (userId) checkNotification();
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);
  useEffect(() => {
    const timerIds = setTimeout(() => {
      setLastPage("");
      if (stickypoint == 0) {
        const stickyEl = document.getElementById("icon-carousel");
        const point = stickyEl.getBoundingClientRect().top - 52;
        setStickypoint(point);
        console.log("el point", point);
      }
    }, 1000);
    return () => clearTimeout(timerIds);
  }, [stickypoint]);

  useEffect(() => {
    console.log("activando effect", lastPage, obsFilter);
    if (lastPage !== "preview" && obsFilter) {
      console.log("caso1");
      requestAnimationFrame(() => {
        // setTimeout(() => {
        console.log("entra");

        const stickyEl = document.getElementById("icon-carousel");
        if (!stickyEl) return;
        // window.scrollTo({ top: stickypoint, behavior: "smooth" });
        window.scrollTo({ top: stickypoint });
        setObsFilter(false);
        // }, 150);
      });
    } else if (!scrolled) {
      console.log("caso2");

      delay(350, () => {
        //para efecto al entrar
        setScrolled(true);
      });

      const id = Cookies.get("homeItemId");
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
        console.log("vamoss");
      };

      requestAnimationFrame(tryScroll);
    }
    console.log("termina");
  }, [listItems.length, filterKey]);

  const checkNotification = async () => {
    try {
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
    } catch {}
  };

  return (
    <main
      className={clsx(
        "flex flex-col w-full bg-white md:pl-[240px] pb-[100px] overflow-x-visible",
        "transform transition-all duration-800 ease-out transition-opacity",
        scrolled // o loading o show, según tu lógica
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-80 translate-y-4 pointer-events-none"
      )}
    >
      <SyncCarousel />

      <section id="icon-carousel" className="sticky top-[52px] z-20 bg-white">
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
