import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

export default function StripeForm({ clientSecret }) {
  const appearance = {
    theme: "dark",
    size: "desktop",
    variables: {
      fontFamily: "Sohne, system-ui, sans-serif",
      fontWeightNormal: "500",
      borderRadius: "8px",
      // colorBackground: "#0A2540",
      colorPrimary: "#00A0D5",
      accessibleColorOnColorPrimary: "#1A1B25",
      // colorText: "white",
      // colorTextSecondary: "white",
      // colorTextPlaceholder: "#727F96",
      // tabIconColor: "white",
      // logoColor: "dark",
    },
    layout: {
      type: "accordion",
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: false,
    },
    // rules: {
    //   ".Input, .Block": {
    //     backgroundColor: "transparent",
    //     border: "1.5px solid var(--colorPrimary)",
    //   },
    // },
  };

  const options = {
    clientSecret: clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
