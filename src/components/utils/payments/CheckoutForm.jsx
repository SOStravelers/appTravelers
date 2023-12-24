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
import SolidButton from "../buttons/SolidButton";
import { toast } from "react-toastify";

export default function CheckoutForm(clientSecret) {
  const secretClient = clientSecret.clientSecret;
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { service } = useStore();
  const [price, setPrice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation?type=stripe`,
      },
    });

    if (error) {
      toast.error(error.message);
    }

    setIsProcessing(false);
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
      <div className="mb-2 text-center  text-md">Billing Details</div>
      <LinkAuthenticationElement />
      {/* <AddressElement
        options={{
          mode: "shipping",
        }}
      /> */}
      <div className="mt-4 text-center mb-2 text-md">Payment Method</div>

      <PaymentElement />
      <SolidButton
        text={
          isProcessing
            ? "Processing..."
            : service.currency == "BRL"
            ? "Pay now " + "R$ " + price
            : service.currency == "USD"
            ? "Pay now " + "USD " + price
            : service.currency == "EUR"
            ? "Pay now " + price + " EUR"
            : "null"
        }
        disabled={!stripe || isProcessing}
      ></SolidButton>
    </form>
  );
}
