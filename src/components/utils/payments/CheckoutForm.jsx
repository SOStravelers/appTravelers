import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  useElements,
  CardElement,
  useStripe,
} from "@stripe/react-stripe-js";
import StripeService from "@/services/StripeService";
import { formatPrice } from "@/utils/format";
import OutlinedButton from "../buttons/OutlinedButton";
import BookingService from "@/services/BookingService";
import { toast } from "react-toastify";
import languageData from "@/language/payment.json";
import FancyLoader from "../loaders/FancyLoader";

const messages = [
  "Agendando tu experiencia",
  "Preparando tu guía local",
  "Verificando disponibilidad",
];
export default function CheckoutForm({
  clientSecret,
  intentType,
  data,
  customer,
  paymentIntent,
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { service, language, currency } = useStore();
  const [price, setPrice] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Confirmar el pago con return_url
      if (intentType == "setup") {
        const { paymentIntent, error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            // return_url: `${window.location.origin}/payment-confirmation?type=stripe`,
          },
          redirect: "if_required", // 👈 esto evita redirigir si no hace falta (ideal)
        });
        // data.customerId = customer;
        // await StripeService.chargeSavedCard(data);
      } else {
        const { paymentIntent, error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // return_url: `${window.location.origin}/payment-confirmation?type=stripe`,
          },
          redirect: "if_required", // 👈 esto evita redirigir si no hace falta (ideal)
        });
      }
      setLoadingBooking(true);
      data.customer = customer;
      data.intentType = intentType;
      data.paymentIntent = paymentIntent;
      await BookingService.create(data);
      setTimeout(() => {
        router.push("/purchase/123123?type=stripe");
      }, 4000);
    } catch (error) {
      console.error("Error en el flujo de pago:", error.message);
      toast.error(error.message);
      setError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-center px-4">
        <p className="text-lg font-semibold text-textColor mb-4">
          Hubo un error al procesar tu pago. Por favor, inténtalo de nuevo.
        </p>

        <OutlinedButton
          text="Volver al inicio"
          onClick={() => router.push("/")}
          textColor="text-white"
          dark={"darkLight"}
          buttonCenter={true}
          textSize="text-xs"
        />
      </div>
    );
  } else {
    return (
      <>
        {!loadingBooking && <FancyLoader messages={messages} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-2 mt-6 text-center text-textColor  text-md">
            {languageData.billingDetails[language]}
          </div>
          {/*<LinkAuthenticationElement />
      
            <AddressElement
              options={{
                mode: "shipping",
              }}
            /> */}{" "}
          <div className="mt-4 text-center text-textColor  mb-2 text-md">
            {languageData.paymentMethod[language]}
          </div>
          <PaymentElement />
          <OutlinedButton
            text={
              isProcessing
                ? "Processing..."
                : languageData.bookNow[language] +
                  ":  " +
                  formatPrice(0, currency)
            }
            px={8}
            py={3}
            minWidth="140px"
            margin="mt-4"
            dark="darkLight"
            textColor="text-white"
            disabled={!stripe || isProcessing}
            buttonCenter={true}
          />
          <p className="mb-6 mt-4 text-textColorGray text-sm">
            {languageData.noStress[language]}
          </p>
        </form>
      </>
    );
  }
}
