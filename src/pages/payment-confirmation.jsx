"useClient";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Rings } from "react-loader-spinner";
import Link from "next/link";

import Cookies from "js-cookie";
//prueba handle 6515996e711d8a6f4596e19e3f0d2e49f59f1f84
import { CompleteGirlIcon, BarberPicture } from "@/constants/icons";
import { io } from "socket.io-client";
import SolidButton from "@/components/utils/buttons/SolidButton";
import languageData from "@/language/paymentConfirmation.json";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import { set } from "date-fns";
import StripeService from "@/services/StripeService";
export default function PaymentConfirmation() {
  const router = useRouter();
  const { service, user, isWorker, resetService, language, currency } =
    useStore();
  const initialized = useRef(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const socket = useRef();
  useEffect(() => {
    document.title = "Confirmation | SOS Travelers";
  }, []);
  useEffect(() => {
    if (
      service == null ||
      service == undefined ||
      service == "" ||
      Object.keys(service).length === 0
    ) {
      router.push("/");
      return;
    }
    // console.log("conect socket booking");
    // const host = process.env.NEXT_PUBLIC_API_SOCKET_IO;
    // socket.current = io(host);
    // return () => {
    //   if (socket.current) {
    //     socket.current.disconnect();
    //   }
    // };
  }, []);
  useEffect(() => {
    console.log("el servicio", service);
    const paymentIntent = router.query.payment_intent;
    if (paymentIntent && !initialized.current) {
      initialized.current = true;
      createBooking(paymentIntent); // Procesar transferencias y reserva
    } else {
      initialized.current = false;
    }
  }, [router.query]);
  const goTo = () => {
    console.log(booking);
    router.push(`/service-details/${booking._id}`);
  };

  const createBooking = async (paymentIntent) => {
    const clientId = user._id || null;
    const params = {
      subservice: service._id,
      language: language,
      clientData: service.clientData,
      startTime: service.startTime,
      clientId: clientId,
      selectedData: service.selectedData,
      eventData: service.eventData,
      payment: {
        paymentId: paymentIntent,
        priceBRL: null,
        method: "stripe",
        status: "pending",
      },
      endTime: service.endTime,
    };

    try {
      // 1. Realizar las transferencias antes de crear la reserva
      // console.log(
      //   "Realizando transferencias para el paymentIntent:",
      //   paymentIntent
      // );
      // const partner = Cookies.get("partner");
      // const timePartner = Cookies.get("timePartner");

      // function estaEnUltimos15Dias(isoString) {
      //   const fechaGuardada = new Date(isoString);
      //   const ahora = new Date();

      //   // 15 días en milisegundos
      //   const quinceDias = 15 * 24 * 60 * 60 * 1000;

      //   // Calculamos el límite inferior (hace 15 días)
      //   const limiteInferior = new Date(ahora - quinceDias);

      //   return fechaGuardada >= limiteInferior && fechaGuardada <= ahora;
      // }

      // const tiempoMax = estaEnUltimos15Dias(timePartner);

      // const data = {
      //   paymentIntentId: paymentIntent,
      //   partner: tiempoMax ? partner : null,
      //   workerUser: service.workerId,
      //   service: service.serviceId,
      //   subService: service.subServiceId,
      // };
      // tiempoMax ? (data.partner = partner) : "";
      // tiempoMax ? (params.payment.partner = partner) : "";
      // const result = await StripeService.handleTransfers(data, true);
      // console.log("resultado", result, result.data);
      // params.payment.priceBRL = result.data.priceBRL;

      await BookingService.create(params);

      if (response.data) {
        console.log("hasta aqui todo bien");
        setBooking(response.data.booking);
        console.log("booking", response.data.booking);
        localStorage.removeItem("service");
        // resetService();

        // !isWorker
        //   ? socket.current.emit("send-booking", { data: response.data.booking })
        //   : "";
        setComplete(true);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        "Error creando la reserva o realizando las transferencias:",
        error.message
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-lg items-center justify-center my-1 px-3 md:ml-80 min-h-screen md:pt-20">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Completing transaction...</p>
        </div>
      ) : complete ? (
        <>
          <div style={{ marginTop: "-100px" }}>
            <CompleteGirlIcon />
          </div>
          <p className="text-blackText text-center mb-18 w-3/4 text-lg">
            {languageData.title[language]}
          </p>
          <p className="text-blackText my-4 text-center mb-18 w-3/4 text-sm">
            {languageData.subtitle[language]}
          </p>
          <div className="mx-12 w-50 px-1" onClick={goTo}>
            <SolidButton
              onClick={() => goTo()}
              text={languageData.button[language]}
              color="blueBorder"
            />
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: "-120px" }}>
            <BarberPicture />
          </div>
          <p className="text-blackText text-center mb-18 w-3/4 text-lg">
            Too late, this booking has already been taken.
          </p>
          <Link className="w-full" href="/summary">
            <div className="mx-12 w-50 px-1">
              <SolidButton text="Back to summary" color="blueBorder" />
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
