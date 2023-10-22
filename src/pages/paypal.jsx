import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPayment from "@/components/paypal/PayPalPayment";

export default function Paypal() {
  const initialOptions = {
    clientId:
      "AZ7ou_HGk4MLJekwoNi_dXZnVu6g-vPfgL3fnz9XqZNqfdWkzKrtFKnezXLkKNGhrEWisrTyaFLwtBtM",
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="w-full max-w-2xl h-screen bg-white text-black py-28 px-5 md:pl-80">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalPayment></PayPalPayment>
      </PayPalScriptProvider>
    </div>
  );
}
