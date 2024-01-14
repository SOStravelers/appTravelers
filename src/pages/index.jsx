import { useEffect, useState } from "react";
import { register } from "swiper/element/bundle";
import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";

import NotificationService from "@/services/NotificationService";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { mazzard } from "@/utils/mazzardFont";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// import SwiperCore, { Pagination, Navigation } from "swiper";
// SwiperCore.use([Pagination, Navigation]);
import { useStore } from "@/store";
register();

export default function Home({}) {
  const store = useStore();
  const { services, setServices, setHaveNotification } = store;
  const [bookings, setBookings] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const [randomUsers, setRandomUsers] = useState([]);

  useEffect(() => {
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
  }, []);

  useEffect(() => {
    document.title = "Home | SOS Travelers";
    checkNotification();
    if (!services || Object.keys(services).length == 0) {
      getData();
    }
    setBookings([
      {
        id: 1,
        direction: "124 street Miro Hotel, Ubud",
        date: "4 Aug, 2023 | 04:30 PM",
      },
      {
        id: 2,
        direction: "124 street Miro Hotel, Ubud",
        date: "4 Aug, 2023 | 04:30 PM",
      },
      {
        id: 3,
        direction: "124 street Miro Hotel, Ubud",
        date: "4 Aug, 2023 | 04:30 PM",
      },
      // {
      //   id: 4,
      //   direction: "124 street Miro Hotel, Ubud",
      //   date: "4 Aug, 2023 | 04:30 PM",
      // },
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

  useEffect(() => {
    getUsers();
  }, []);

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
      // checkNotification();

      // console.log(response.data);
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
          {bookings?.map((booking) => (
            <SwiperSlide key={booking?.id}>
              <BookingCard
                direction={booking?.direction}
                date={booking?.date}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

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
        <div className="grid grid-cols-2 sm:grid-cols-3  gap-4 max-w-lg overflow-x-auto  pb-10">
          {randomUsers?.map((s, index) => (
            <RecomendationCard key={index} user={s} />
          ))}
        </div>
      </section>
    </main>
  );
}
