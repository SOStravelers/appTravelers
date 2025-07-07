import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";
import { useStore } from "@/store";
import CardSummaryService from "@/components/summary/cardSummaryService";
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
    console.log("el ");
    // // Busca el objeto de precio con la moneda proporcionada
    // const priceObject = service.price.find(
    //   (price) => price.currency === currency
    // );

    // // Si se encontró el objeto de precio, devuelve el costo final
    // if (priceObject) {
    //   return priceObject.finalCost;
    // }

    if (service.typeService == "tour" && service.selectedData) {
      console.log("entro eentro");
      return service.selectedData.totalPrice;
    } else {
      console.log("sale sale");
      throw new Error("Datos insuficientes para crear el pago.");
    }

    // Si no se encontró el objeto de precio, devuelve null
    // return null;
  }

  useEffect(() => {
    setLoading(true);
    delay(250, () => {
      setLoading(false);
    });
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
      console.log("se viene");
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
      console.log("el amount", amount);
      const currencyValue = ["brl", "usd", "eur"].includes(
        currency?.toLowerCase()
      )
        ? currency.toLowerCase()
        : "brl";

      const laData = {
        amount,
        currency: currencyValue,
        service: service.serviceName,
        subservice: service.nameSubservice,
        date: service.date,
        startTime: service.startTime,
        selectedData: service.selectedData,
        language: service.language,
      };
      console.log("la data", laData);
      const response = await StripeService.createPaymentIntent(laData, true);

      console.log("Respuesta de createIntent:", response.data);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error al crear el PaymentIntent:", error.message);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 p-4 mt-2 flex flex-col items-center
              transform transition-all duration-800 ease-out
              transition-opacity duration-800 ease-out
             ${loading ? opacityAnimation : displayAnimation}
            `}
    >
      {/* <h1 className="text-md font-bold mb-1">{thisLanguage.title[language]}</h1> */}
      {/* Contendio Tarjeta Summary */}

      <CardSummaryService status={false} />
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </div>
  );
}
