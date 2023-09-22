import { useLayoutEffect, useState } from "react";

import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";

import UserService from "@/services/UserService";
import { useStore } from "@/store";
import ServiceService from "@/services/ServiceService";
import { mazzard } from "@/utils/mazzardFont";

export default function Home({ user }) {
  const { setUser, setLoggedIn } = useStore();

  const [services, setServices] = useState([]);

  useLayoutEffect(() => {
    if (user) {
      setUser(user);
      setLoggedIn(true);
    }
    getData();
  }, []);

  const getData = async () => {
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
    });
  };

  return (
    <main className="flex flex-col bg-blanco pb-20 px-5">
      <BookingCard />

      <section>
        <h1
          className={`text-negro text-xl font-semibold mt-10 mb-5 ${mazzard.className}`}
        >
          Services
        </h1>
        <div className="flex overflow-x-auto pb-10">
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
          className={`text-negro text-xl font-semibold mb-5 ${mazzard.className}`}
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

export async function getServerSideProps({ req }) {
  const userId = req.cookies["auth.user_id"];
  let user = null;
  try {
    if (userId) {
      const response = await UserService.get(userId);
      user = response.data;
    }
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      user: user,
    },
  };
}
