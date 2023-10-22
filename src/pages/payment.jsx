import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Payment() {
  const router = useRouter();

  const [paymentType, setPaymentType] = useState("stripe");

  const pay = async () => {
    let url = "/";
    switch (paymentType) {
      case "paypal":
        url = "/paypal";
        break;
      case "stripe":
        url = "/stripe";
        break;
    }
    router.push(url);
  };

  return (
    <div className="flex flex-col items-center md:items-start justify-between py-28 px-5 md:pl-80 min-h-[70vh]">
      <div className="flex flex-col w-full max-w-lg">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center my-3"
            onClick={() => setPaymentType("stripe")}
          >
            <Image
              src={"/icons/visa.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <p className="ml-2">Debit / Credit Card</p>
          </div>
          <input
            type="radio"
            name="payment"
            id="card"
            value="stripe"
            onChange={(event) => setPaymentType(event.target.value)}
            checked={paymentType === "stripe"}
          />
        </div>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center my-3"
            onClick={() => setPaymentType("paypal")}
          >
            <Image
              src={"/icons/paypal.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <p className="ml-2">Debit / Credit Card</p>
          </div>
          <input
            type="radio"
            name="payment"
            id="paypal"
            value="paypal"
            onChange={(event) => setPaymentType(event.target.value)}
            checked={paymentType === "paypal"}
          />
        </div>
      </div>
      <OutlinedButton text="Continue" color="lightBlue" onClick={pay} />
    </div>
  );
}
