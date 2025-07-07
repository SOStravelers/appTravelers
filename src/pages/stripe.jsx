import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";
import { useStore } from "@/store";
import StripeService from "@/services/StripeService";
import { useRouter } from "next/router";
export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const initialized = useRef(false);
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
    <section className="py-20 md:py-24 px-5 md:pl-80 w-full max-w-2xl">
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </section>
  );
}
