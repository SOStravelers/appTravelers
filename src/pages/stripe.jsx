import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";
import { useStore } from "@/store";
import CardSummaryService from "@/components/summary/CardSummaryService";
import StripeService from "@/services/StripeService";
import { useRouter } from "next/router";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true); // <-- loading flag
  const { service, currency } = useStore();
  function getFinalCost() {
    if (
      (service.typeService == "tour" || service.typeService == "product") &&
      service.selectedData
    ) {
      return service.selectedData.totalPrice;
    } else {
      throw new Error("Datos insuficientes para crear el pago.");
    }
  }

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = "Your Payment | SOS Travelers";
    if (
      service == null ||
      service == undefined ||
      service == "" ||
      Object.keys(service).length === 0
    ) {
      router.push("/");
      return;
    }
    if (!initialized.current) {
      initialized.current = true;
      createPaymentIntent();
    } else {
      initialized.current = false;
    }
  }, []);

  const createPaymentIntent = async () => {
    try {
      if (!service) {
        throw new Error("El servicio no está definido.");
      }
      if (!currency) {
        throw new Error("Datos insuficientes para crear el pago.");
      }

      const amount = getFinalCost() * 100;
      const currencyValue = ["brl", "usd", "eur"].includes(
        currency?.toLowerCase()
      )
        ? currency.toLowerCase()
        : "brl";

      const laData = {
        amount,
        currency: currencyValue,
        clientData: service.clientData,
        startTime: service.startTime,
        selectedData: service.selectedData,
        language: service.language,
        subservice: service._id,
      };
      const response = await StripeService.createPaymentIntent(laData, true);

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error al crear el PaymentIntent:", error.message);
    }
  };

  return (
    <div
      className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      {/* <h1 className="text-md font-bold mb-1">{thisLanguage.title[language]}</h1> */}
      {/* Contendio Tarjeta Summary */}

      {/* <CardSummaryService modalOptions={false} statusExpanded={false} /> */}
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </div>
  );
}
