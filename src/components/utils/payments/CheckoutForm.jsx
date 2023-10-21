import { useState } from "react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import SolidButton from "../buttons/SolidButton";

import { toast } from "react-toastify";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

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

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <SolidButton
        text={isProcessing ? "Precessing..." : "Pay now"}
        disabled={!stripe || isProcessing}
      ></SolidButton>
    </form>
  );
}
