import { useLayoutEffect } from "react";

import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";

import UserService from "@/services/UserService";
import { useStore } from "@/store";

export default function Home({ user }) {
  const { setUser, setLoggedIn } = useStore();

  useLayoutEffect(() => {
    if (user) {
      setUser(user);
      setLoggedIn(true);
    }
  }, []);

  return (
    <main className="flex flex-col bg-blanco pb-10 px-5">
      <BookingCard />

      <section>
        <h1 className="text-negro text-xl font-semibold mt-10 mb-5">
          Services
        </h1>
        <div className="flex overflow-x-auto pb-10">
          <ServiceCard link={"/subservices"} name={"Servicio"} />
          <ServiceCard link={"/subservices"} name={"Servicio"} />
          <ServiceCard link={"/subservices"} name={"Servicio"} />
        </div>
      </section>

      <section>
        <h1 className="text-negro text-xl font-semibold mb-5">
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

export async function getServerSideProps({ req }) {
  const userId = req.cookies["auth.user_id"];
  let user = null;
  try {
    const response = await UserService.get(userId);
    user = response.data;
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      user: user,
    },
  };
}
