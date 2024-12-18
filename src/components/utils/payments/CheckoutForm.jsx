import { useState, useEffect } from "react";
import { useStore } from "@/store";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useElements,
  CardElement,
  useStripe,
} from "@stripe/react-stripe-js";
import StripeService from "@/services/StripeService";
import SolidButton from "../buttons/SolidButton";
import { toast } from "react-toastify";
import languageData from "@/language/payment.json";

export default function CheckoutForm(clientSecret) {
  const secretClient = clientSecret.clientSecret;
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { service, language } = useStore();
  const [price, setPrice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Confirmar el pago con return_url
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation?type=stripe`,
        },
      });

      if (error) {
        console.error("Error confirmando el pago:", error.message);
        toast.error("Hubo un error al procesar el pago.");
        setIsProcessing(false);
        return;
      }

      console.log("Pago confirmado:", paymentIntent.id);

      // Llamar a StripeService para manejar las transferencias
      await StripeService.handleTransfers(paymentIntent.id);

      console.log("Transferencias realizadas con éxito.");
      toast.success("Pago y transferencias realizadas con éxito.");
    } catch (error) {
      console.error("Error en el flujo de pago:", error.message);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    getFinalCost(service, service.currency);
  }, []);
  function getFinalCost(service, currency) {
    console.log(currency);
    // Busca el objeto de precio con la moneda proporcionada
    const priceObject = service.price.find(
      (price) => price.currency === currency
    );
    // Si se encontró el objeto de precio, devuelve el costo final
    if (priceObject) {
      setPrice(priceObject.finalCost);

      return priceObject.finalCost;
    }

    // Si no se encontró el objeto de precio, devuelve null
    setPrice(null);

    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-6 text-center text-sm">
        {languageData.noStress[language]}
      </p>
      <div className="mb-2 text-center  text-md">
        {languageData.billingDetails[language]}
      </div>
      <LinkAuthenticationElement />
      {/* <AddressElement
        options={{
          mode: "shipping",
        }}
      /> */}{" "}
      <div className="mt-4 text-center mb-2 text-md">
        {languageData.paymentMethod[language]}
      </div>
      <PaymentElement />
      <SolidButton
        text={
          isProcessing
            ? "Processing..."
            : service.currency == "BRL"
            ? languageData.bookNow[language] + " R$ " + price
            : service.currency == "USD"
            ? languageData.bookNow[language] + " USD " + price
            : service.currency == "EUR"
            ? languageData.bookNow[language] + price + " EUR"
            : "null"
        }
        disabled={!stripe || isProcessing}
      ></SolidButton>
    </form>
  );
}
