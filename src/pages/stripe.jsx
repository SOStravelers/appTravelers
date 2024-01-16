import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";
import { useStore } from "@/store";
import StripeService from "@/services/StripeService";

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const initialized = useRef(false);
  const { service } = useStore();
  function getFinalCost(service, currency) {
    // Busca el objeto de precio con la moneda proporcionada
    const priceObject = service.price.find(
      (price) => price.currency === currency
    );

    // Si se encontró el objeto de precio, devuelve el costo final
    if (priceObject) {
      return priceObject.finalCost;
    }

    // Si no se encontró el objeto de precio, devuelve null
    return null;
  }

  useEffect(() => {
    document.title = "Your Payment | SOS Travelers";
    if (!initialized.current) {
      initialized.current = true;
      createPaymentIntent();
    } else {
      initialized.current = false;
    }
  }, []);

  const createPaymentIntent = async () => {
    StripeService.createPaymentIntent({
      amount: getFinalCost(service, service.currency) * 100,
      currency: service.currency.toLowerCase(),
    }).then((response) => {
      console.log(response.data);
      setClientSecret(response.data.clientSecret);
    });
  };

  return (
    <section className="py-20 md:py-24 px-5 md:pl-80 w-full max-w-2xl">
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </section>
  );
}
