import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LockIcon, MoneyIcon, CheckIcon } from "@/constants/icons";
import Image from "next/image";
import { useStore } from "@/store";
import { Field } from "houseform";
import { set } from "date-fns";

export default function Payment() {
  const { service, setService } = useStore();
  const [paymentType, setPaymentType] = useState("stripe");
  const router = useRouter();
  const [price, setPrice] = useState(service.price[0].finalCost);

  const handleSelectChange = (event) => {
    setService({ currency: event.target.value });
    getFinalCost(service, event.target.value);
  };
  function getFinalCost(service, currency) {
    console.log(currency);
    // Busca el objeto de precio con la moneda proporcionada
    const priceObject = service.price.find(
      (price) => price.currency === currency
    );
    // Si se encontró el objeto de precio, devuelve el costo final
    if (priceObject) {
      setPrice(priceObject.finalCost);

      return priceObject.finalCost;
    }

    // Si no se encontró el objeto de precio, devuelve null
    setPrice(null);

    return null;
  }

  useEffect(() => {
    document.title = "Payment - SOS Travelers";
  }, []);

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
        <div className="mb-3">
          <p>Change Currency</p>
          <select
            className="border-grey border w-full max-w-lg rounded-xl p-3 my-1"
            value={service?.currency}
            onChange={handleSelectChange}
          >
            {service?.price?.map((price) => (
              <option value={price.currency}>{price.currency}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-blackBlue font-semibold text-xl">
            Total service:
            {service.currency == "BRL"
              ? "  R$ " + price
              : service.currency == "USD"
              ? "  USD " + price
              : service.currency == "EUR"
              ? "  " + price + " EUR"
              : "  Not available"}
          </p>
        </div>
        <div
          className="flex justify-between items-center"
          onClick={() => setPaymentType("stripe")}
        >
          <div className="flex items-center my-3">
            <Image
              onClick={() => setPaymentType("stripe")}
              src={"/icons/visa.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <p className="ml-2">Debit / Credit Card</p>
          </div>

          {paymentType === "stripe" ? (
            <CheckIcon />
          ) : (
            <input
              type="radio"
              name="payment"
              id="card"
              disabled
              className="w-5 h-5 "
              value="stripe"
              onChange={(event) => setPaymentType(event.target.value)}
              checked={paymentType === "stripe"}
            />
          )}
        </div>
        <div
          className="flex justify-between items-center"
          // onClick={() => setPaymentType("paypal")}
        >
          <div className="flex items-center my-3">
            <Image
              src={"/icons/paypal.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <div>
              <p className="ml-2">Paypal</p>
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
            // onChange={(event) => setPaymentType(event.target.value)}
            checked={paymentType === "paypal"}
          />
        </div>
        <div className="flex mt-3 justify-between items-center">
          <div className="flex items-center my-3">
            <div className="">
              <MoneyIcon />
            </div>
            <div>
              <p className="ml-2">Cash</p>
              <p className="ml-2">(Comming soon)</p>
            </div>
          </div>
          <input
            type="radio"
            disabled
            name="payment"
            id="cash"
            className="w-5 h-5 "
            value="cash"
            // onChange={(event) => setPaymentType(event.target.value)}
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
