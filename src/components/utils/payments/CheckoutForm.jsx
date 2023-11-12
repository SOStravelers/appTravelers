import { useState } from "react";
import {
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
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
      <div className="mb-2 text-center  text-md">Billing Details</div>
      <LinkAuthenticationElement />
      <AddressElement
        options={{
          mode: "shipping",
        }}
      />
      <div className="mt-4 text-center mb-2 text-md">Payment Method</div>

      <PaymentElement />
      <SolidButton
        text={isProcessing ? "Processing..." : "Pay now"}
        disabled={!stripe || isProcessing}
      ></SolidButton>
    </form>
  );
}
