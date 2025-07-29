import { useRouter } from "next/router";
import { useStore } from "@/store";
import { useState, useEffect } from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import languageData from "@/language/routeTitles.json";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function Profile({ user }) {
  useEffect(() => {
    document.title = "Config Admin | SOS Travelers";
  }, []);
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  const router = useRouter();
  const { setUser, setLoggedIn, setWorker, language } = useStore();
  const [loading, setLoading] = useState(true);

  return (
    <div
      className={`min-h-screen bg-backgroundP pt-4 px-6  flex flex-col items-center
              transform transition-all duration-800 ease-out
              transition-opacity duration-800 ease-out
             ${loading ? opacityAnimation : displayAnimation}
            `}
    >
      <div className="w-full max-w-md flex flex-col self-center">
        <h1 className="text-center text-textColor text-xl mb-5 ">
          Admistrador
        </h1>

        <h2 className=" text-textColor text-md mb-3 mt-5  ml-20">
          1. Configuraciones
        </h2>
        <OutlinedButton
          onClick={() => router.push("/config/subservice")}
          text={"Config Subservicios"}
          px={8}
          py={2}
          margin={"my-3"}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          buttonCenter={true}
        />
        <OutlinedButton
          onClick={() => router.push("/config/subservice/create")}
          text={"Crear Subservicio"}
          px={8}
          py={2}
          margin={"my-3"}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          buttonCenter={true}
        />

        <OutlinedButton
          onClick={() => router.push("/config/matches")}
          text={"Config Partidos"}
          px={8}
          py={2}
          margin={"my-3"}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          buttonCenter={true}
        />
        <h2 className=" text-textColor text-md mb-2 mt-8  ml-20">
          2. Reservas y pagos
        </h2>
        <OutlinedButton
          onClick={() => router.push("/config/bookings")}
          text={"Agenda de bookings"}
          px={8}
          margin={"my-3"}
          py={2}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          buttonCenter={true}
        />
        <OutlinedButton
          onClick={() => router.push("/config/createPaymentLink")}
          text={"Generar Link Stripe"}
          px={8}
          margin={"my-3"}
          py={2}
          dark="darkLight"
          textSize="text-sm"
          textColor="text-white"
          buttonCenter={true}
        />
      </div>
    </div>
  );
}
