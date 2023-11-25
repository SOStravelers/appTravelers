import { useEffect, useRef, useState } from "react";
import StripeForm from "@/components/utils/payments/StripeForm";

import StripeService from "@/services/StripeService";

export default function Stripe() {
  const [clientSecret, setClientSecret] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    document.title = "Your Payment - SOS Travelers";
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
      console.log("perro");
      console.log(response.data);
      setClientSecret(response.data.clientSecret);
    });
  };

  return (
    <section className="py-28 px-5 md:pl-80 w-full max-w-2xl">
      {clientSecret && <StripeForm clientSecret={clientSecret} />}
    </section>
  );
}

// export async function getServerSideProps(context) {
//   const csp = `default-src 'self'; connect-src 'self' https://api.stripe.com https://errors.stripe.com https://r.stripe.com https://merchant-ui-api.stripe.com;`;
//   context.res.setHeader("Content-Security-Policy", csp);

//   const response = await StripeService.createPaymentIntent({
//     amount: 100,
//   });

//   const clientSecret = response.data.paymentIntent.client_secret;
//   this.setClientSecret(response.data.clientSecret);

//   return {
//     props: { clientSecret }, // will be passed to the page component as props
//   };
// }
