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
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";
export default function CheckoutForm(clientSecret) {
  const secretClient = clientSecret.clientSecret;
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { service, language, currency } = useStore();
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
    getFinalCost();
  }, []);
  function getFinalCost() {
    if (service.typeService == "tour" && service.selectedData) {
      if (service.canCancel) {
        const hasCancel = isBeforeHoursThreshold(
          service.startTime.isoTime,
          service.timeUntilCancel
        );
        if (hasCancel) {
          setPrice(formatPrice(0));
        } else {
          setPrice(formatPrice(service.selectedData.totalPrice));
        }
      } else {
        setPrice(formatPrice(service.selectedData.totalPrice));
      }

      return;
    } else {
      console.log("sale sale");
      throw new Error("Datos insuficientes para crear el pago.");
    }

    // Si no se encontró el objeto de precio, devuelve null
    // return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2 mt-6 text-center  text-md">
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
        mt={5}
        text={
          isProcessing
            ? "Processing..."
            : currency == "brl"
            ? languageData.bookNow[language] + " R$ " + price
            : currency == "usd"
            ? languageData.bookNow[language] + " USD " + price
            : currency == "eur"
            ? languageData.bookNow[language] + " " + price + " EUR"
            : "null"
        }
        disabled={!stripe || isProcessing}
      ></SolidButton>
      <p className="mb-6 mt-4 text-center text-sm">
        {languageData.noStress[language]}
      </p>
    </form>
  );
}
