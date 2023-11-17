import { useEffect, useState } from "react";
import { register } from "swiper/element/bundle";

import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";

import { useStore } from "@/store";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { mazzard } from "@/utils/mazzardFont";

register();

export default function Home({}) {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { setService } = useStore();
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
    ]);
    //setService(null);
  }, []);

  useEffect(() => {
    const swiperEl = document.querySelector("swiper-container");
    const swiperParams = {
      slidesPerView: 1,
      pagination: true,
      navigation: false,
      spaceBetween: 10,
      rewind: true,
      injectStyles: [
        ".swiper-pagination-bullet-active{ background-color: #00A0D5;}",
        ".swiper-button-next{ color: #00A0D5;}",
        ".swiper-button-prev{ color: #00A0D5;}",
      ],
    };
    Object.assign(swiperEl, swiperParams);
    if (bookings?.length > 0) swiperEl.initialize();
  }, [bookings]);

  const getData = async () => {
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
    });
  };

  return (
    <main className="flex flex-col w-full bg-white py-16 px-4 md:pl-80">
      <div className="w-full max-w-lg ">
        <swiper-container init="false">
          {bookings?.map((booking) => (
            <swiper-slide key={booking?.id} className="flex justify-center">
              <BookingCard
                direction={booking?.direction}
                date={booking?.date}
              />
            </swiper-slide>
          ))}
        </swiper-container>
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
