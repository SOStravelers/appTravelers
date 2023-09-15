import SolidButton from "@/components/utils/buttons/SolidButton";
import Image from "next/image";

export default function Payment() {
  return (
    <div className="px-10 flex flex-col items-center justify-between my-5 min-h-[70vh]">
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center my-3">
            <Image
              src={"/icons/visa.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <p className="ml-2">Debit / Credit Card</p>
          </div>
          <input type="radio" name="card" id="card" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center my-3">
            <Image
              src={"/icons/paypal.svg"}
              width={50}
              height={50}
              alt="Credit Card Logo"
            />
            <p className="ml-2">Debit / Credit Card</p>
          </div>
          <input type="radio" name="paypal" id="paypal" />
        </div>
      </div>
      <SolidButton text="Continue" color="azul" />
    </div>
  );
}
