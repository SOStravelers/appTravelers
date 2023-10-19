import { useEffect, useState } from "react";

import BookingCard from "@/components/utils/cards/BookingCard";
import ServiceCard from "@/components/utils/cards/ServiceCard";
import RecomendationCard from "@/components/utils/cards/RecomendationCard";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import ServiceService from "@/services/ServiceService";
import { mazzard } from "@/utils/mazzardFont";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { nextAuth } from "../pages/api/auth/[...nextauth].js";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Home() {
  const router = useRouter();

  const { user, setUser, setLoggedIn } = useStore();
  const [services, setServices] = useState([]);
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setLoggedIn(true);
    } else {
      let id = localStorage.getItem("auth.user_id");
      if (id) {
        getUser(id);
      }
    }
    getData();
  }, [user]);
  const getUser = async (id) => {
    try {
      const response = await UserService.get(id);
      if (response) {
        setUser(response.data);
        setLoggedIn(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Error 401: No autorizado");
        localStorage.removeItem("auth.access_token");
        localStorage.removeItem("auth.refresh_token");
        localStorage.removeItem("auth.user_id");

        Cookies.remove("auth.access_token");
        Cookies.remove("auth.refresh_token");
        Cookies.remove("auth.user_id");
        setUser({});
        setLoggedIn(false);
        signOut({ redirect: false });
        router.push("/");
      } else {
        //console.error("Otro error:", error);
      }
    }
  };
  const getData = async () => {
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
    });
  };

  return (
    <main className="flex flex-col bg-white pb-20 px-5">
      <BookingCard />

      <section>
        <h1
          className={`text-black text-xl font-semibold mt-10 mb-5 ${mazzard.className}`}
        >
          Services
        </h1>
        <div className="w-[90vw] flex overflow-x-auto pb-5">
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
