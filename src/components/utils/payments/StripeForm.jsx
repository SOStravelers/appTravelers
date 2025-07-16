import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useStore } from "@/store";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeForm({ clientSecret }) {
  const { language, currency, user } = useStore();
  const [appearance, setAppearance] = useState(null);

  useEffect(() => {
    const primaryColor = getComputedCSSVar("--color-text-blueBorderDark");
    const textColor = getComputedCSSVar("--color-text-color");
    const textColorGray = getComputedCSSVar("--color-text-gray");
    const placeholderColor = getComputedCSSVar("--color-text-gray");
    const bgColor = getComputedCSSVar("--color-background-modal");

    setAppearance({
      theme: "stripe",
      variables: {
        colorPrimary: primaryColor || "#00A0D5",
        colorText: textColorGray || "#000000",
        colorTextPlaceholder: placeholderColor || "#999999",
        colorBackground: bgColor || "#ffffff",
        borderRadius: "8px",
        fontFamily: "Sohne, system-ui, sans-serif",
        fontWeightNormal: "500",
      },
      rules: {
        ".Input, .Block": {
          backgroundColor: "transparent",
          border: `1.5px solid ${primaryColor || "#00A0D5"}`,
          color: textColor || "#000",
        },
      },
    });
  }, []);

  if (!appearance) return null; // Espera a que cargue

  const options = {
    clientSecret,
    locale: language || "en",
    defaultValues: {
      email: user?.email || "",
    },
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}

function getComputedCSSVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
