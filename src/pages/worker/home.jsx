import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import BookingCard from "@/components/utils/cards/BookingCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import NotificationService from "@/services/NotificationService";
import dayjs from "dayjs";
import BookingService from "@/services/BookingService";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";
import { Rings } from "react-loader-spinner";

import UserService from "@/services/UserService";
import { useStore } from "@/store";

import "swiper/swiper-bundle.css";
import { set } from "date-fns";
// import SwiperCore, { Pagination, Navigation } from "swiper";
// SwiperCore.use([Pagination, Navigation]);

export default function WorkerHome() {
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const { setService, user, setHaveNotification } = useStore();
  const [swiper, setSwiper] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getBookings();
    checkNotification();
  }, []);

  const getBookings = () => {
    const today = dayjs().format("YYYY-MM-DD");
    BookingService.getBookingsByListWorker(today)
      .then((response) => {
        setBookings(response.data.docs);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  const checkNotification = async () => {
    try {
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = "Worker Home | SOS Travelers";
    setSlides([
      {
        id: 1,
        title: "Dicas SOS",
        body: "Só é possível cancelar uma reserva até 2 horas antes do início.",
        // direction: "124 street Miro Hotel, Ubud",
        // date: "4 Aug, 2023 | 04:30 PM",
      },
      {
        id: 2,
        title: "Dicas SOS",
        body: (
          <span>
            Lembre-se de pressionar o botão
            <span style={{ fontWeight: "600" }}> Terminar o trabalho </span>
            ao finalizar o trabalho para poder ser remunerado.
          </span>
        ),
      },
      {
        id: 3,
        title: "Dicas SOS",
        body: "Se você não aceitar um trabalho solicitado nos primeiros 30 minutos, qualquer trabalhador poderá realizá-lo.",
      },

      // {
      //   id: 3,
      //   title: "New booking",
      //   direction: "124 street Miro Hotel, Ubud",
      //   date: "4 Aug, 2023 | 04:30 PM",
      // },
      // {
      //   id: 4,
      //   direction: "124 street Miro Hotel, Ubud",
      //   date: "4 Aug, 2023 | 04:30 PM",
      // },
    ]);
    setService(null);
  }, []);

  useEffect(() => {
    localStorage.removeItem("service");
    localStorage.removeItem("fromFavorite");
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

  const handleBookService = () => {
    setService({
      workerId: user?._id,
    });
    goTo(`/services/${user?._id}`);
  };

  const goTo = (path) => {
    router.push(path);
  };

  return (
    <main className="flex flex-col bg-white  py-16 lg:mt-5 xl:mt-5 px-4 md:pl-80 md:items-start">
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

      <section className=" mb-1 flex w-full max-w-lg items-center ">
        <div className="flex flex-grow items-center ">
          <OutlinedButton text="Book a service" onClick={handleBookService} />
        </div>
      </section>

      <section className="flex w-full max-w-lg items-center flex-col">
        <div className="items-center ">
          <h1 className="text-black text-xl font-medium text-center my-1">
            Upcoming
          </h1>
        </div>
        <div className="flex flex-col w-full max-w-lg">
          {loading ? (
            <div className="max-w-lg flex flex-col items-center justify-center">
              <Rings
                width={100}
                height={100}
                color="#00A0D5"
                ariaLabel="infinity-spin-loading"
              />
            </div>
          ) : (
            bookings
              /*                 .filter(
                  (booking) =>
                    booking.date.stringData === dayjs().format("YYYY-MM-DD")
                ) */
              .slice(0, 5)
              .map((booking) => (
                <WorkerCardBooking
                  key={booking._id}
                  booking={booking}
                  subService={booking.subservice.name}
                  status={booking.status}
                  service={booking.service.name}
                  avatar={booking?.businessUser?.img?.imgUrl}
                  date={booking.date.stringData}
                  hour={booking.startTime.stringData}
                  name={`${booking?.businessUser?.businessData?.name}`}
                />
              ))
          )}
          {!loading && bookings.length === 0 && (
            <p className="text-center text-greyText max-w-lg my-3">
              {"Não há reservas para hoje"}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
