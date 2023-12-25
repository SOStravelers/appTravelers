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
  const { service, user } = useStore();
  const initialized = useRef(false);

  useEffect(() => {
    console.log("el servicio", service);
    const paymentIntent = router.query.payment_intent;
    if (paymentIntent && !initialized.current) {
      initialized.current = true;
      createBooking(paymentIntent);
    } else {
      initialized.current = false;
    }
  }, [router.query]);

  const createBooking = async (paymentIntent) => {
    const client = user._id;
    const params = {
      workerUser: service.workerId,
      clientUser: client,
      payment: {
        paymentId: paymentIntent,
        price: service.price.number,
        method: "stripe",
        status: "pending",
      },
      creatorUser: user._id,
      location: service.location,
      businessUser: service.hostelId,
      price: service.price.number,
      startTime: service.startTime,
      duration: service.duration,
      endTime: service.endTime,
      date: {
        stringData: service.date,
        isoDate: service.startTime.isoTime,
      },
      subservice: service.subServiceId,
      service: service.serviceId,
    };
    const response = await BookingService.create(params);
    console.log(response);
    localStorage.removeItem("service");
  };

  return (
    <div className="flex flex-col max-w-lg items-center justify-center my-4 px-3 md:ml-80 min-h-screen">
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
      <Link className="w-full" href="/bookings">
        <div className="mx-16">
          <SolidButton text="Back to my bookings" color="blueBorder" />
        </div>
      </Link>
      <FinishLogo />
    </div>
  );
}
