import { useEffect, useState } from "react";
import { register } from "swiper/element/bundle";

import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";

import ServiceService from "@/services/ServiceService";
import { mazzard } from "@/utils/mazzardFont";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
// import SwiperCore, { Pagination, Navigation } from "swiper";
// SwiperCore.use([Pagination, Navigation]);

register();

export default function Home({}) {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [swiper, setSwiper] = useState(null);
  useEffect(() => {
    document.title = "Home - SOS Travelers";
    getData();
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

  const getData = async () => {
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
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
          className={`text-black text-xl font-semibold mt-2 mb-5 ${mazzard.className}`}
        >
          Services
        </h1>
        <div className="w-[90vw] md:w-full flex overflow-x-auto mb-5">
          {services?.map((s) => (
            <ServiceCard
              key={s.id}
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
        <div className="flex overflow-x-auto pb-10">
          <RecomendationCard />
          <RecomendationCard />
        </div>
      </section>
    </main>
  );
}
