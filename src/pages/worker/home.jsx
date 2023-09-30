import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import BookingCard from "@/components/utils/cards/BookingCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import WorkerCardBookingWorker from "@/components/utils/cards/WorkerCardBookingWorker";

import UserService from "@/services/UserService";
import { useStore } from "@/store";

export default function WorkerHome({ user }) {
  const router = useRouter();
  const { setUser, setLoggedIn } = useStore();

  useEffect(() => {
    if (user) {
      setUser(user);
      setLoggedIn(true);
    }
  }, []);

  const goTo = (path) => {
    router.push(path);
  };

  return (
    <main className="flex flex-col bg-white pb-20 px-5">
      <BookingCard />

      <section className="py-5">
        <OutlinedButton
          text="Book a service"
          onClick={() => goTo("/worker/booking")}
        />
      </section>

      <section className="flex flex-col items-center">
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
