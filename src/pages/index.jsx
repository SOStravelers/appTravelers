import { useEffect, useState } from "react";
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
// import SwiperCore, { Pagination, Navigation } from "swiper";
// SwiperCore.use([Pagination, Navigation]);
import { useStore } from "@/store";
register();
import SyncCarousel from "@/components/utils/carousels/SyncCarousel";
import ServiceList from "@/components/service/ServiceList";

export default function Home({}) {
  // console.log("socket!", process.env.NEXT_PUBLIC_API_SOCKET_IO);
  // console.log("env!", process.env.NEXT_PUBLIC_NODE_ENV);
  const store = useStore();
  const { services, setServices, setHaveNotification, setService, language } =
    store;
  const [bookings, setBookings] = useState([]);
  const [slides, setSlides] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  var userId = Cookies.get("auth.user_id");
  useEffect(() => {
    setService({});
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    document.title = "Home | SOS Travelers";
    if (userId) {
      checkNotification();
    }
    if (!services || Object.keys(services).length == 0) {
      getData();
    }
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
        // direction: "124 street Miro Hotel, Ubud",
        // date: "4 Aug, 2023 | 04:30 PM",
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
  useEffect(() => {
    const timer = setInterval(() => {
      if (swiper) {
        swiper.slideNext();
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [swiper]);

  const getData = async () => {
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
    });
  };
  const checkNotification = async () => {
    try {
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
      // console.log(response.data);
    } catch (error) {
      // console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await UserService.getRandom();
      setRandomUsers(response.data);

      const response2 = await UserService.getWorkers();
      setWorkers(response2.data);
      console.log("worker", workers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col w-full bg-white   md:pl-[240px]">
      {process.env.NEXT_PUBLIC_DEMO == "true" && (
        <div className="flex justify-center mt-1 items-center bg-blueBorder max-w-lg text-white  rounded-md">
          <p className="text-center">Esta é uma versão demo</p>
        </div>
      )}
      <SyncCarousel />
      <section className="px-3">
      <IconCarousel />
      </section>

      <section className="mx-auto">
      <RecomendationCarousel services={randomUsers?.flatMap(user=>user.workerData.services.flatMap(service=>service.subServices))}></RecomendationCarousel>
      </section>
      
      <div className="w-full max-w-lg mx-auto">
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
          {slides?.map((slide) => (
            <SwiperSlide key={slide?.id}>
              <BookingCard
                title={slide?.title}
                body={slide?.body}
                direction={slide?.direction}
                date={slide?.date}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div>
        <FloatingWhatsAppButton />
      </div>
      {process.env.NEXT_PUBLIC_NODE_ENV != "productionsss" ? (
        <>
          <section>
            <h1
              className={`text-black text-xl font-semibold mb-3 ${mazzard.className}`}
            >
              {languageData.title.service[language]}
            </h1>
            <div className="w-full max-w-lg flex justify-center overflow-x-auto mb-2 pl-2">
              {services?.map((s, index) => (
                <ServiceCard
                  key={index}
                  id={s.id}
                  img={s.imgUrl}
                  link={`/subservices/${s.id}`}
                  name={s.name[language]}
                />
              ))}
            </div>
          </section>
          <section className="mb-1">
            <h1
              className={`text-black text-xl font-semibold mt-2 mb-5 ${mazzard.className}`}
            >
              {languageData.title.recommended[language]}
            </h1>
            {loading ? (
              <div className="max-w-lg flex flex-col items-center justify-center">
                <Rings
                  width={100}
                  height={100}
                  color="#00A0D5"
                  ariaLabel="infinity-spin-loading"
                />
                <p>Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3  gap-4 max-w-lg overflow-x-auto  pb-10">
                {randomUsers?.map((s, index) => (
                  <RecomendationCard key={index} user={s} />
                ))}
              </div>
            )}
          </section>

          {workers?.length > 0 && (
            <section>
              <h1
                className={`text-black text-xl font-semibold mt-2 mb-5 ${mazzard.className}`}
              >
                {languageData.title.ourPartners[language]}
              </h1>

              {loading ? (
                <div className="max-w-lg flex flex-col items-center justify-center">
                  <Rings
                    width={100}
                    height={100}
                    color="#00A0D5"
                    ariaLabel="infinity-spin-loading"
                  />
                  <p>Loading...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 mb-10  gap-4 max-w-lg overflow-x-auto  pb-10">
                  {workers.map((s, index) => (
                    <WorkerIndexCard key={index} user={s} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center max-w-lg  align-items">
          <NotFoundPicture />
          <h1 className="flex justify-center mt-10">
            We are hard at work to get back into action{" "}
          </h1>
        </div>
      )}
      {/* <ServiceList></ServiceList> */}

    </main>
  );
}
