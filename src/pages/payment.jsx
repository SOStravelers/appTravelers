import SolidButton from "@/components/utils/buttons/SolidButton";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Payment() {
  const [paymentType, setPaymentType] = useState("stripe");

  const pay = async () => {
    console.log(paymentType);
  };

  useEffect(() => {
    console.log(paymentType);
  }, [paymentType]);

  return (
    <div className="px-10 flex flex-col items-center justify-between my-5 min-h-[70vh]">
      <div className="flex flex-col w-full">
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
            onClick={() => setPaymentType("stripe")}
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
      <SolidButton text="Continue" color="azul" onClick={pay} />
    </div>
  );
}
