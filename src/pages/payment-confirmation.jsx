"useClient";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { FinishLogo, CompleteGirlIcon } from "@/constants/icons";

import SolidButton from "@/components/utils/buttons/SolidButton";

import { useStore } from "@/store";
import BookingService from "@/services/BookingService";

import moment from "moment";

export default function PaymentConfirmation() {
  const router = useRouter();
  const { service } = useStore();
  const initialized = useRef(false);

  useEffect(() => {
    const paymentIntent = router.query.payment_intent;
    if (paymentIntent && !initialized.current) {
      initialized.current = true;
      createBooking();
    } else {
      initialized.current = false;
    }
  }, [router.query]);

  const createBooking = async () => {
    const userId = localStorage.getItem("auth.user_id");
    const startTime = service.hour.toUpperCase();
    const endTime = moment(service.hour, "hh:mm a")
      .add(1, "hour")
      .format("hh:mm a")
      .toUpperCase();
    const params = {
      worker: service.workerId,
      client: userId,
      creator: userId,
      startTime: startTime,
      endTime: endTime,
      date: service.date,
    };
    const response = await BookingService.create(params);
    console.log(response);
  };

  return (
    <div className="flex flex-col max-w-lg items-center justify-center my-4 px-5 md:ml-80 min-h-screen">
      <CompleteGirlIcon />
      {/* <Image
        alt="fotoFinal"
        src={"/assets/bgPayment.png"}
        width={250}
        height={250}
      /> */}

      <p className="text-blackText text-center mt-10 mb-18 w-3/4 text-lg">
        Payment made and your booking has been made successfully.
      </p>
      <Link className="w-full" href="/">
        <div className="mx-20">
          <SolidButton text="Back to see booking" color="blueBorder" />
        </div>
      </Link>
      <FinishLogo />
    </div>
  );
}
