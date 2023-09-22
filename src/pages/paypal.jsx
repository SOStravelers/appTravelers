import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPayment from "@/components/paypal/PayPalPayment";


export default function Paypal() {
  const initialOptions = {
    clientId: "AZ7ou_HGk4MLJekwoNi_dXZnVu6g-vPfgL3fnz9XqZNqfdWkzKrtFKnezXLkKNGhrEWisrTyaFLwtBtM",
    currency: "USD",
    intent: "capture",
  };


  return(
  <div className="w-screen h-screen bg-white text-black">
    <PayPalScriptProvider options={initialOptions}>
      <PayPalPayment></PayPalPayment>
    </PayPalScriptProvider>
    
  </div>
  ) 




}
