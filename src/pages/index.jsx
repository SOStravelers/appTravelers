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
      console.log("inicio");
      if (stickypoint == 0) {
        const stickyEl = document.getElementById("icon-carousel");
        console.log("el sticky", stickyEl);
        const point = stickyEl.getBoundingClientRect().top - 52;
        console.log("the point", point);
        setStickypoint(point);
        console.log("el point1", stickyEl.getBoundingClientRect().top);
        console.log("el point", stickypoint);
      }
    }, 1000);
    return () => clearTimeout(timerIds);
  }, [stickypoint]);

  useEffect(() => {
    const handleScroll = () => {
      console.log("🔵 Scroll actual:", window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLastPage("");
    }, 500);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    console.log("acitvando");
    if (lastPage !== "preview" && obsFilter) {
      setScrolled(true);
      setObsFilter(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const stickyEl = document.getElementById("icon-carousel");
            if (!stickyEl) return;

            const style = window.getComputedStyle(stickyEl);
            const isSticky =
              style.position === "sticky" || style.position === "fixed";
            console.log("antes sticky", isSticky);
            if (isSticky) {
              const stickyY =
                stickyEl.getBoundingClientRect().top + window.scrollY - 52;
              console.log(
                "🟢 Scroll final calculado:",
                stickyEl.getBoundingClientRect().top,
                stickyY,
                window.scrollY,
                stickypoint
              );
              window.scrollTo({ top: stickypoint, behavior: "smooth" });
            }
          }, 50);
        });
      });
    } else {
      const id = Cookies.get("homeItemId");
      console.log("la id", Cookies.get("homeItemId"), !id);
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

  // useEffect(() => {
  //   console.log("otro scroll");
  //   if (!hasMounted.current) {
  //     hasMounted.current = true;
  //     return; // ❌ Ignora la primera vez
  //   }
  //   if (lastPage !== "preview") {
  //     setScrolled(true);

  //     requestAnimationFrame(() => {
  //       requestAnimationFrame(() => {
  //         setTimeout(() => {
  //           const stickyEl = document.getElementById("icon-carousel");
  //           if (!stickyEl) return;

  //           const style = window.getComputedStyle(stickyEl);
  //           const isSticky =
  //             style.position === "sticky" || style.position === "fixed";
  //           console.log("antes sticky", isSticky);
  //           if (isSticky) {
  //             const stickyY =
  //               stickyEl.getBoundingClientRect().top + window.scrollY - 52;
  //             console.log("🟢 Scroll final calculado:", stickyY);
  //             if (window.scrollY == stickyY) return;
  //             window.scrollTo({ top: stickyY, behavior: "smooth" });
  //           }
  //         }, 50);
  //       });
  //     });
  //   }
  // }, [
  //   lastPage,
  //   // filterKey,
  //   listItems.length,
  // ]);

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
        scrolled
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
