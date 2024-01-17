import { useState } from "react";
import Link from "next/link";
import ClientForm from "@/components/utils/forms/ClientForm";
import TextModal from "@/components/utils/modal/TextModal";
import { useEffect } from "react";
// import { getSession } from "next-auth/react";

export default function AssignClient() {
  const [modal, setModal] = useState(true);

  return (
    <div className="mt-4 p-10 pb-20 flex mx-4  flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="text-blackText font-semibold text-xl mt-5">
        Registre seu cliente
      </h1>
      <h2 className="text-blackText mt-2 mb-5">
        Digite as seguintes informações do cliente
      </h2>
      <div className="w-full md:w-80">
        <ClientForm />
      </div>
      <TextModal
        open={modal}
        setOpen={setModal}
        text={[
          "A seguinte informação será usada APENAS para registrar o trabalho realizado e enviar um link para avaliar o serviço prestado",
        ]}
        onAccept={() => setModal(false)}
        buttonText={"Confirmar"}
      />
    </div>
  );
}
