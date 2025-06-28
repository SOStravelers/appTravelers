import { useEffect, useState } from "react";
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
import { ThreeDots } from "react-loader-spinner";
import { LogoSosRelleno } from "@/constants/icons";

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
        console.log("el point guardado de pantalla", point);
      }
    }, 1000);
    return () => clearTimeout(timerIds);
  }, [stickypoint]);

  useEffect(() => {
    console.log("activacion scroll");
    if (lastPage !== "preview" && obsFilter) {
      console.log("scroll al apretar un filtro");
      setScrolled(true);
      setObsFilter(false);
      requestAnimationFrame(() => {
        setTimeout(() => {
          const stickyEl = document.getElementById("icon-carousel");
          if (!stickyEl) return;
          console.log("stikcyPoint", window.scrollY, stickypoint);
          if (window.scrollY >= stickypoint) {
            window.scrollTo({ top: stickypoint });
          } else {
            window.scrollTo({ top: stickypoint, behavior: "smooth" });
          }
        }, 50);
      });
    } else {
      console.log("scroll de inicio");
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
        <div className="fixed inset-0 h-screen w-screen bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-300 opacity-100">
          <LogoSosRelleno />
          <p className="font-medium mt-4 text-xl">SOS Travelers</p>
          <ThreeDots
            wrapperStyle={{ marginTop: "-25px" }}
            width={100}
            height={100}
            color="black"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      )}
      <main
        className={clsx(
          "flex flex-col w-full bg-white md:pl-[240px] pb-[100px] overflow-x-visible",
          scrolled && loadingCarrouselVideos
            ? "opacity-100 transition-opacity duration-300"
            : "opacity-0 pointer-events-none"
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

        {/* {process.env.NEXT_PUBLIC_NODE_ENV !== "productionsss" (
          <></>
        ) : (
          <div className="flex flex-col justify-center max-w-lg items-center">
            <NotFoundPicture />
            <h1 className="mt-10 text-center">
              We are hard at work to get back into action
            </h1>
          </div>
        )} */}
      </main>
    </>
  );
}
