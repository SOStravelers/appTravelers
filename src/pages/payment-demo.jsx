import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { CompleteGirlIcon, BarberPicture } from "@/constants/icons";
import SolidButton from "@/components/utils/buttons/SolidButton";
import ContactForm from "@/components/utils/forms/ContactForm";

export default function PaymentConfirmation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    document.title = "Confirmation | SOS Travelers";
  }, []);
  const goTo = () => {
    console.log(booking);
    router.push(`/`);
  };

  return (
    <div className="flex flex-col max-w-lg items-center justify-center my-1 px-3 md:ml-80 min-h-screen md:pt-20">
      <div
        className="flex items-center justify-center"
        style={{ marginTop: "-130px" }}
      >
        <CompleteGirlIcon style={{ transform: "scale(0.7)" }} />
        <p className="text-blackText text-center w-3/4 text-lg">
          Reserva concluída com sucesso.
        </p>
      </div>
      <div
        style={{ marginTop: "-90px" }}
        className="flex justify-center items-center bg-blueBorder text-white py-1  rounded-md"
      >
        <p className="text-center">
          Seja parceiro da Sos Travelers e ganhe até 20% por cada servicio em
          seu hostel!!
        </p>
      </div>

      <h2 className="text-blackText mt-2 mb-5">
        Deixe seus dados e entraremos em contato
      </h2>
      <div className="w-80  md:w-80 ">
        <ContactForm />
      </div>
      {/* <div className="mx-12 w-50 px-1" onClick={goTo}>
        <SolidButton
          onClick={() => goTo()}
          text="Go to Home"
          color="blueBorder"
        />
      </div> */}
    </div>
  );
}
