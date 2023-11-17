import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import BookingCard from "@/components/utils/cards/BookingCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import WorkerCardBookingWorker from "@/components/utils/cards/WorkerCardBookingWorker";

import UserService from "@/services/UserService";
import { useStore } from "@/store";

import "swiper/swiper-bundle.css";
import SwiperCore, { Pagination, Navigation } from "swiper";
SwiperCore.use([Pagination, Navigation]);

export default function WorkerHome({ user }) {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const { setService } = useStore();
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    document.title = "Worker Home - SOS Travelers";
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
    setService(null);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (swiper) {
        swiper.slideNext();
      }
    }, 3500);

    return () => {
      clearInterval(timer);
    };
  }, [swiper]);

  const goTo = (path) => {
    router.push(path);
  };

  return (
    <main className="flex flex-col bg-white  py-16 lg:mt-5 xl:mt-5 px-4 md:pl-80">
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

      <section className="mt-20 mb-5">
        <OutlinedButton
          text="Book a service"
          onClick={() => goTo("/worker/booking")}
        />
      </section>

      <section className="flex flex-col items-center md:items-start">
        <h1 className="text-black text-xl font-medium text-center my-5">
          Upcoming
        </h1>

        <WorkerCardBookingWorker
          link="/worker/booking"
          name="John Doe"
          location="New York, USA"
        />
        <WorkerCardBookingWorker
          link="/worker/booking"
          name="John Doe"
          location="New York, USA"
        />
      </section>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const userId = req.cookies["auth.user_id"];
  let user = null;
  if (userId) {
    try {
      const response = await UserService.get(userId);
      user = response.data;
    } catch (error) {
      console.error(error);
    }
  }
  return {
    props: {
      user: user,
    },
  };
}
