import Image from "next/image";
import SolidButton from "@/components/utils/buttons/SolidButton";
import Link from "next/link";

export default function PaymentConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center my-5 px-10 min-h-screen">
      <Image src={"/assets/bgPayment.png"} width={250} height={250} />
      <p className="text-blackText text-center mt-10 mb-20 w-3/4 text-lg">
        Payment made and your booking has been made successfully.
      </p>
      <Link className="w-full" href="/">
      <SolidButton text="Back to home" color="lightBlue" />
      </Link>
    </div>
  );
}
