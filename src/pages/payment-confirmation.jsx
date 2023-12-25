"useClient";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Rings } from "react-loader-spinner";
import Link from "next/link";
import { CompleteGirlIcon, BarberPicture } from "@/constants/icons";

import SolidButton from "@/components/utils/buttons/SolidButton";

import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import { set } from "date-fns";

export default function PaymentConfirmation() {
  const router = useRouter();
  const { service, user } = useStore();
  const initialized = useRef(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);

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
    try {
      const response = await BookingService.create(params);
      if (response.status === 200) {
        localStorage.removeItem("service");
        setComplete(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-lg items-center justify-center my-1 px-3 md:ml-80 min-h-screen">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Completing transaction...</p>
        </div>
      ) : complete ? (
        <>
          <div style={{ marginTop: "-120px" }}>
            <CompleteGirlIcon />
          </div>
          <p className="text-blackText text-center mb-18 w-3/4 text-lg">
            Payment made and your booking has been made successfully.
          </p>
          <Link className="w-full" href="/booking">
            <div className="mx-12 w-50 px-1">
              <SolidButton text="Back to my bookings" color="blueBorder" />
            </div>
          </Link>
        </>
      ) : (
        <>
          <div style={{ marginTop: "-120px" }}>
            <BarberPicture />
          </div>
          <p className="text-blackText text-center mb-18 w-3/4 text-lg">
            Too late, this booking has already been taken.
          </p>
          <Link className="w-full" href="/summary">
            <div className="mx-12 w-50 px-1">
              <SolidButton text="Back to summary" color="blueBorder" />
            </div>
          </Link>
        </>
      )}
    </div>
  );
}
