import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { register } from "swiper/element/bundle";
import RecomendationCarousel from "@/components/utils/carousels/RecomendationCarousel";
import IconCarousel from "@/components/utils/carousels/IconsCarousel";
import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";
import WorkerIndexCard from "@/components/utils/cards/WorkerIndexCard";
import { Rings } from "react-loader-spinner";
import NotificationService from "@/services/NotificationService";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { mazzard } from "@/utils/mazzardFont";
import FloatingWhatsAppButton from "../components/utils/buttons/FloatingWhatsAppButton";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import { NotFoundPicture } from "@/constants/icons";
import languageData from "@/language/home.json";
import "swiper/swiper-bundle.css";
import { useStore } from "@/store";
register();
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
    /* ---------- NUEVO ---------- */
    restoreScroll,
    setRestoreScroll,
    homeScrollY,
    setScrollY,
    setLastPage,
  } = store;

  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [slides, setSlides] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // const homeScrollY = useStore((s) => s.homeScrollY);
  const listItems = useStore((s) => s.listItems); // tarjetas ya cargadas
  const restoredRef = useRef(false);

  /* ---------- ajuste restauración de scroll ---------- */
  useEffect(() => {
    // if (!restoreScroll) return; // ← sólo si la bandera está activa
    // if (restoredRef.current) return;
    // if (!restoreScroll || listItems.length === 0) return;

    requestAnimationFrame(() => {
      console.log("entrasssss", homeScrollY);
      const altura = Cookies.get("homeScrollY");
      window.scrollTo(0, altura);
      restoredRef.current = true;
      setRestoreScroll(false); // ← la apagamos
    });
  }, [listItems, restoreScroll]);
  /* -------------------------------------------------- */

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
    setSlides([
      {
        id: 0,
        title:
          languageData.carrousel[0].title[language] +
          ", " +
          languageData.carrousel[0].title2[language],
        body: languageData.carrousel[0].body[language],
      },
      {
        id: 1,
        title:
          languageData.carrousel[1].title[language] +
          ", " +
          languageData.carrousel[0].title2[language],
        body: languageData.carrousel[1].body[language],
      },
      {
        id: 2,
        title:
          languageData.carrousel[2].title[language] +
          ", " +
          languageData.carrousel[0].title2[language],
        body: languageData.carrousel[2].body[language],
      },
    ]);
  }, []);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (swiper) swiper.slideNext();
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, [swiper]);

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

  // const getUsers = async () => {
  //   try {
  //     const resp1 = await UserService.getRandom();
  //     setRandomUsers(resp1.data);
  //     const resp2 = await UserService.getWorkers();
  //     setWorkers(resp2.data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // contador para forzar remount
  const [filterKey, setFilterKey] = useState(0);
  // control del modal
  const [isFilterOpen, setFilterOpen] = useState(false);

  const handleFilterChange = () => {
    setFilterKey((k) => k + 1);
  };

  return (
    <main className="flex flex-col w-full bg-white md:pl-[240px] pb-[100px] overflow-x-visible">
      <SyncCarousel />

      {/* Aquí aplicamos sticky */}
      <section className="sticky top-[58px] z-20 bg-white">
        <IconCarousel
          onFilterChange={handleFilterChange}
          onOpenFilter={() => setFilterOpen(true)}
        />
      </section>

      {/* <section className="p-4">
        <RecomendationCarousel services={randomUsers} />
      </section> */}

      {/* <div className="w-full p-4 pt-10 max-w-lg mx-auto">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          onSwiper={(s) => setSwiper(s)}
          loop={true}
          pagination={{ clickable: true }}
          style={{
            "--swiper-pagination-color": "#00A0D5",
            "--swiper-pagination-bullet-active-color": "#1111",
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <BookingCard
                title={slide.title}
                body={slide.body}
                direction={slide.direction}
                date={slide.date}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div> */}

      <FloatingWhatsAppButton />

      {process.env.NEXT_PUBLIC_NODE_ENV !== "productionsss" ? (
        <>
          {/* <section>
            <h1
              className={`text-black text-xl font-semibold mb-3 ${mazzard.className}`}
            >
              {languageData.title.service[language] + "-> wena"}
            </h1>
            <div className="w-full max-w-lg flex justify-center overflow-x-auto mb-2 pl-2">
              {services.map((s, i) => (
                <ServiceCard
                  key={i}
                  id={s.id}
                  img={s.imgUrl}
                  link={`/subservices/${s.id}`}
                  name={s.name[language]}
                />
              ))}
            </div>
          </section> */}

          {/* Puedes descomentar estas secciones si las necesitas */}
          {/*
          <section className="mb-1">
            <h1 className={`text-black text-xl font-semibold mt-2 mb-5 ${mazzard.className}`}>
              {languageData.title.recommended[language] + "->chao"}
            </h1>
            {loading ? (
              <div className="max-w-lg flex flex-col items-center justify-center">
                <Rings width={100} height={100} color="#00A0D5" ariaLabel="loading" />
                <p>Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg overflow-x-auto pb-10">
                {randomUsers.map((u, i) => (
                  <RecomendationCard key={i} user={u} />
                ))}
              </div>
            )}
          </section>

          {workers.length > 0 && (
            <section>
              <h1 className={`text-black text-xl font-semibold mt-2 mb-5 ${mazzard.className}`}>
                {languageData.title.ourPartners[language]}
              </h1>
              {loading ? (
                <div className="max-w-lg flex flex-col items-center justify-center">
                  <Rings width={100} height={100} color="#00A0D5" ariaLabel="loading" />
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg overflow-x-auto pb-10">
                  {workers.map((w, i) => (
                    <WorkerIndexCard key={i} user={w} />
                  ))}
                </div>
              )}
            </section>
          )}
          */}
        </>
      ) : (
        <div className="flex flex-col justify-center max-w-lg items-center">
          <NotFoundPicture />
          <h1 className="mt-10 text-center">
            We are hard at work to get back into action
          </h1>
        </div>
      )}

      <section className="p-4">
        <ServiceList filterKey={filterKey} />
      </section>

      {/* nuestro modal separado */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterChange}
      />
    </main>
  );
}
