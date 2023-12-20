import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LockIcon } from "@/constants/icons";
import Image from "next/image";

export default function Payment() {
  const router = useRouter();
  useEffect(() => {
    document.title = "Payment - SOS Travelers";
  }, []);

  const [paymentType, setPaymentType] = useState(null);

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
    <div className="flex flex-col items-center md:items-start  py-20 lg:py-24 xl:py-24 px-8 md:pl-80 min-h-[70vh]">
      <div className="flex flex-col w-full max-w-lg pb-10">
        <div
          className="flex justify-between items-center"
          onClick={() => setPaymentType("stripe")}
        >
          <div className="flex items-center my-3">
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
            className="w-5 h-5"
            value="stripe"
            onChange={(event) => setPaymentType(event.target.value)}
            checked={paymentType === "stripe"}
          />
        </div>
        <div
          className="flex justify-between items-center"
          onClick={() => setPaymentType("paypal")}
        >
          <div className="flex items-center my-3">
            <Image
              src={"/icons/paypal.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <div>
              <p className="ml-2">Debit / Credit Card</p>
              <p className="ml-2">(Comming soon)</p>
            </div>
          </div>
          <input
            type="radio"
            name="payment"
            className="w-5 h-5"
            id="paypal"
            disabled
            value="paypal"
            onChange={(event) => setPaymentType(event.target.value)}
            checked={paymentType === "paypal"}
          />
        </div>
        <div className="flex mt-3 justify-between items-center">
          <div className="flex items-center my-3">
            <div className="ml-2">
              <LockIcon />
            </div>
            <p className="ml-8">{"Cash (Comming soon)"}</p>
          </div>
          <input
            type="radio"
            disabled
            name="payment"
            id="cash"
            className="w-5 h-5"
            value="cash"
            onChange={(event) => setPaymentType(event.target.value)}
            checked={paymentType === "cash"}
          />
        </div>
      </div>
      <OutlinedButton
        disabled={paymentType == null}
        text="Continue"
        color="lightBlue"
        onClick={pay}
      />
    </div>
  );
}
