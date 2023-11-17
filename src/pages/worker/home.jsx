import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { register } from "swiper/element/bundle";
import BookingCard from "@/components/utils/cards/BookingCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import WorkerCardBookingWorker from "@/components/utils/cards/WorkerCardBookingWorker";

import UserService from "@/services/UserService";
import { useStore } from "@/store";
register();
export default function WorkerHome({ user }) {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const { setService } = useStore();
  const { setUser, setLoggedIn } = useStore();
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
    ]);
    setService(null);
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

  const goTo = (path) => {
    router.push(path);
  };

  return (
    <main className="flex flex-col bg-white  py-16 px-4 md:pl-80">
      {/* <BookingCard /> */}

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

      <section className="mt-2 mb-5">
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
