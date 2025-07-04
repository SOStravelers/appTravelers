import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";
import { useStore } from "@/store";
import StripeService from "@/services/StripeService";
import { useRouter } from "next/router";
export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const initialized = useRef(false);
  const { service } = useStore();
  function getFinalCost(service, currency) {
    console.log("el ");
    // // Busca el objeto de precio con la moneda proporcionada
    // const priceObject = service.price.find(
    //   (price) => price.currency === currency
    // );

    // // Si se encontró el objeto de precio, devuelve el costo final
    // if (priceObject) {
    //   return priceObject.finalCost;
    // }

    return service.total;

    // Si no se encontró el objeto de precio, devuelve null
    // return null;
  }

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

      const amount = getFinalCost(service, service.currency) * 100;
      const currency = service.currency?.toLowerCase() || "brl";

      if (!amount || !currency) {
        throw new Error("Datos insuficientes para crear el pago.");
      }

      const response = await StripeService.createPaymentIntent(
        {
          amount,
          currency,
          service: service.serviceName,
          subservice: service.nameSubservice,
          date: service.date,
          startTime: service.startTime,
          clientsNumber: service.clientsNumber,
          language: service.language,
        },
        true
      );

      console.log("Respuesta de createIntent:", response.data);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error al crear el PaymentIntent:", error.message);
    }
  };

  return (
    <section className="py-20 md:py-24 px-5 md:pl-80 w-full max-w-2xl">
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </section>
  );
}
