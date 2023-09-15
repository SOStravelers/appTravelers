import { useEffect, useRef, useState } from "react";

import StripeForm from "@/components/utils/payments/StripeForm";

import StripeService from "@/services/StripeService";

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      createPaymentIntent();
    } else {
      initialized.current = false;
    }
  }, []);

  const createPaymentIntent = async () => {
    StripeService.createPaymentIntent({
      amount: 100,
    }).then((response) => {
      console.log(response.data);
      setClientSecret(response.data.paymentIntent.client_secret);
    });
  };

  return (
    <section className="m-3">
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </section>
  );
}
