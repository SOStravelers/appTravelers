import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";
import { useStore } from "@/store";
import StripeService from "@/services/StripeService";
import { useRouter } from "next/router";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { service, currency } = useStore();

  function getFinalCost() {
    if (
      (service.typeService === "tour" || service.typeService === "product") &&
      service.selectedData
    ) {
      return service.selectedData.totalPrice;
    } else {
      throw new Error("Datos insuficientes para crear el pago.");
    }
  }

  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = "Your Payment | SOS Travelers";

    const checkAccess = () => {
      if (typeof window === "undefined") return;
      console.log("wena-->", localStorage.getItem("fromContactInfo"));
      console.log("wena 2->>", service);
      console.log("wena 3->>", Object.keys(service).length);
      const fromContactInfo =
        localStorage.getItem("fromContactInfo") === "true";

      if (!fromContactInfo || !service || Object.keys(service).length === 0) {
        console.log("set Error");
        setError(true);
        return;
      }

      if (!initialized.current) {
        initialized.current = true;
        createPaymentIntent();
      }
    };

    delay(checkAccess);
  }, []);

  const createPaymentIntent = async () => {
    try {
      if (!service || !currency) {
        throw new Error("Datos insuficientes para crear el pago.");
      }

      const amount = getFinalCost();
      const currencyValue = ["brl", "usd", "eur"].includes(
        currency?.toLowerCase()
      )
        ? currency.toLowerCase()
        : "brl";

      const laData = {
        amount,
        currency: currencyValue,
        clientData: service.clientData,
        startTime: service.startTime,
        selectedData: service.selectedData,
        language: service.language,
        subservice: service._id,
      };

      const response = await StripeService.createPaymentIntent(laData, true);
      console.log("wena54", response.data);
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error al crear el PaymentIntent:", error.message);
      setError(true);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-center px-4">
        <p className="text-lg font-semibold text-textColor mb-4">
          No hay información suficiente para mostrar la pasarela de pago.
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
  }

  return (
    <div
      className={`px-6 flex flex-col items-center
      ${loading ? opacityAnimation : displayAnimation}
    `}
    >
      {clientSecret && (
        <StripeForm
          clientSecret={clientSecret}
          onPaymentSuccess={() => {
            localStorage.removeItem("fromContactInfo");
          }}
        />
      )}
    </div>
  );
}
