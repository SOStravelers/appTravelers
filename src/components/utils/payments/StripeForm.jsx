import React, { useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripePublicKey);

export default function StripeForm({ clientSecret }) {
  const options = {
    clientSecret: clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
