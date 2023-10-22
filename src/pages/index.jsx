import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";

import { useStore } from "@/store";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { mazzard } from "@/utils/mazzardFont";

export default function Home({}) {
  const [services, setServices] = useState([]);
  const { setService } = useStore();
  useEffect(() => {
    getData();
    //setService(null);
  }, []);

  const getData = async () => {
    console.log("sa");
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
    });
  };

  return (
    <main className="flex flex-col w-full bg-white py-28 px-5 md:pl-80">
      <BookingCard />

      <section>
        <h1
          className={`text-black text-xl font-semibold mt-10 mb-5 ${mazzard.className}`}
        >
          Services
        </h1>
        <div className="w-[90vw] md:w-full flex overflow-x-auto pb-5">
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
          className={`text-black text-xl font-semibold mb-5 ${mazzard.className}`}
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
