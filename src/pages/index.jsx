import { useEffect, useState } from "react";
import { register } from "swiper/element/bundle";
import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";
import { Rings } from "react-loader-spinner";
import NotificationService from "@/services/NotificationService";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { mazzard } from "@/utils/mazzardFont";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import { NotFoundPicture } from "@/constants/icons";
import "swiper/swiper-bundle.css";
// import SwiperCore, { Pagination, Navigation } from "swiper";
// SwiperCore.use([Pagination, Navigation]);
import { useStore } from "@/store";
register();

export default function Home({}) {
  console.log("socket!", process.env.NEXT_PUBLIC_API_SOCKET_IO);
  console.log("env", process.env.NEXT_PUBLIC_ENVIRONMENT);
  const store = useStore();
  const { services, setServices, setHaveNotification, setService } = store;
  const [bookings, setBookings] = useState([]);
  const [slides, setSlides] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);
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
        id: 1,
        title: "Tips SOS",
        body: "Just 3 snappy steps: pick your service, grab a cool hostel, choose your pro, and seal the deal for instant excitement! 🌟 ",
      },
      {
        id: 2,
        title: "Tips SOS",
        body: "You'll only bust out your wallet once the service is a smashing success! 💸✨",
        // direction: "124 street Miro Hotel, Ubud",
        // date: "4 Aug, 2023 | 04:30 PM",
      },
      {
        id: 3,
        title: "Tips SOS",
        body: "Rock up 15 minutes early to your chosen hostel and let the good times roll when the service kicks off! 🚀⏰",
      },

      {
        id: 4,
        title: "Tips SOS",
        body: "Once your booking is a done deal, unleash the chat vibes with your pro! 🗨️🎉",
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
    UserService.getRandom().then((response) => {
      setRandomUsers(response.data);
      setLoading(false);
    });
  };

  return (
    <main className="flex flex-col w-full bg-white py-16 lg:py-20 xl:py-20 px-4 md:pl-80">
      <div className="w-full max-w-lg ">
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
      {process.env.NEXT_PUBLIC_ENVIRONMENT != "production" ? (
        <>
          <section>
            <h1
              className={`text-black text-xl font-semibold mt-1 mb-3 ${mazzard.className}`}
            >
              Choose a service
            </h1>
            <div className="w-full max-w-lg flex justify-center overflow-x-auto mb-2">
              {services?.map((s, index) => (
                <ServiceCard
                  key={index}
                  id={s.id}
                  link={`/subservices/${s.id}`}
                  name={s.name}
                />
              ))}
            </div>
          </section>

          <section>
            <h1
              className={`text-black text-xl font-semibold mt-2 mb-5 ${mazzard.className}`}
            >
              Recommended for you
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
        </>
      ) : (
        <div className="flex flex-col justify-center max-w-lg  align-items">
          <NotFoundPicture />
          <h1 className="flex justify-center mt-10">
            We are hard at work to get back into action{" "}
          </h1>
        </div>
      )}
    </main>
  );
}
