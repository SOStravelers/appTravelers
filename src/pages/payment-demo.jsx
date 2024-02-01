import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  CompleteGirlIcon,
  BarberPicture,
  ArrowUpIcon,
} from "@/constants/icons";
import SolidButton from "@/components/utils/buttons/SolidButton";
import ContactForm from "@/components/utils/forms/ContactForm";
import ComboBox from "@/components/utils/combobox/ComboBox";
export default function PaymentConfirmation() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    document.title = "Confirmation | SOS Travelers";
  }, []);
  const [isTextVisible1, setIsTextVisible1] = useState(false);
  const [isTextVisible2, setIsTextVisible2] = useState(false);
  const [isTextVisible3, setIsTextVisible3] = useState(false);

  const toggleText1 = () => {
    setIsTextVisible1(!isTextVisible1);
  };
  const toggleText2 = () => {
    setIsTextVisible2(!isTextVisible2);
  };
  const toggleText3 = () => {
    setIsTextVisible3(!isTextVisible3);
  };
  const goTo = () => {
    console.log(booking);
    router.push(`/`);
  };

  return (
    <div className="flex flex-col max-w-lg items-center justify-center my-1 mb-10 px-3 md:ml-80 min-h-screen md:pt-20">
      <div
        className="flex items-center justify-center"
        style={{ marginTop: "-50px" }}
      >
        <CompleteGirlIcon style={{ transform: "scale(0.7)" }} />
        <p className="text-blackText text-center w-3/4 text-md">
          Reserva concluída com sucesso.
        </p>
      </div>
      <div
        style={{ marginTop: "-100px" }}
        className="flex justify-center items-center bg-blueBorder text-white py-1 px-1 mx-4 rounded-md"
      >
        <p className="text-center text-lg">
          Seja parceiro da Sos Travelers e ganhe até 20% por cada servicio em
          seu hostel!!
        </p>
      </div>

      <h2 className="text-blackText mx-4 mt-2 mb-3">
        Deixe seus dados e entraremos em contato
      </h2>
      <div className="w-80  md:w-80 ">
        <ContactForm />
      </div>
      <div className="flex- justify-start ml-8">
        {/* Seccion 1 */}
        <div>
          <div
            className="grid grid-cols-5 gap-4 items-center cursor-pointer"
            onClick={toggleText1}
          >
            <div className="col-span-4 text-left text-sm py-2 my-5">
              <h1 className="text-lg">
                O que a Sos Travelers faz pelo seu Hostel?
              </h1>
            </div>
            <div className="col-span-1">
              <ArrowUpIcon
                color={"#5B78C7"}
                className={`${isTextVisible1 ? "rotate-180" : "rotate-90"} `}
              />
            </div>
          </div>

          <div
            style={{ marginLeft: "-2px" }}
            className={`overflow-hidden mx-10 transition-all duration-700 ease-in-out ${
              isTextVisible1 ? "max-h-screen" : "max-h-0"
            }`}
          >
            <p className=" font-bold">Variedade de serviços personalizados</p>
            <p className=" mb-2">
              De massagens relaxantes a cortes de cabelo e tatuagens, conectamos
              seus hóspedes com uma ampla gama de serviços personalizados para
              atender às suas necessidades.
            </p>
            <p className=" font-bold"> Plataforma fácil de user</p>
            <p className=" mb-2">
              Nosso aplicativo intuitivo facilita aos seus hóspedes descobrir e
              reservar serviços com apenas alguns toques em seus dispositivos
              móveis.
            </p>
            <p className=" font-bold"> Valor agregado para seus hóspedes</p>
            <p className=" mb-2">
              Com a Sos Travelers, seus hóspedes desfrutarão de uma experiência
              além das comodidades tradicionais, tornando sua estadia algo
              inesquecível.
            </p>
          </div>
        </div>
        {/* Seccion 2 */}
        <div>
          <div
            className="grid grid-cols-5 gap-4 items-center cursor-pointer"
            onClick={toggleText2}
          >
            <div className="col-span-4 text-left text-sm py-2 my-5">
              <h1 className="text-lg">
                Como a Sos Travelers beneficia o seu Hostel?
              </h1>
            </div>
            <div className="col-span-1">
              <ArrowUpIcon
                color={"#5B78C7"}
                className={`${isTextVisible1 ? "rotate-180" : "rotate-90"} `}
              />
            </div>
          </div>
          <div
            style={{ marginLeft: "-2px" }}
            className={`overflow-hidden mx-10 transition-all duration-700 ease-in-out ${
              isTextVisible2 ? "max-h-screen" : "max-h-0"
            }`}
          >
            <p className=" font-bold "> Difenciação competitiva</p>
            <p className=" mb-2">
              Destaque-se oferecendo serviços inovadores e únicos que melhorarão
              a reputação do seu hostel frente à concorrência.
            </p>
            <p className=" font-bold"> Geração de receita adicional</p>
            <p className=" mb-2">
              Obtenha receita extra por meio de comissões sobre transações
              realizadas em nossa plataforma. Oferecemos 20% de cada serviço
              realizado.
            </p>
            <p className=" font-bold "> Maior retensão de hóspedes</p>
            <p className=" mb-2">
              Fomentamos a lealdade de seus hóspedes ao proporcionar
              experiências que superam suas expectativas, aumentando assim a
              probabilidade de retorno.
            </p>
          </div>
        </div>
        {/* Seccion 3 */}
        <div>
          <div
            className="grid grid-cols-5 gap-4 items-center cursor-pointer"
            onClick={toggleText3}
          >
            <div className="col-span-4 text-left text-sm py-2 my-5">
              <h1 className="text-lg">Como Você Pode Começar?</h1>
            </div>
            <div className="col-span-1">
              <ArrowUpIcon
                color={"#5B78C7"}
                className={`${isTextVisible3 ? "rotate-180" : "rotate-90"} `}
              />
            </div>
          </div>
          <div
            style={{ marginLeft: "-2px" }}
            className={`overflow-hidden mx-10 transition-all duration-700 ease-in-out ${
              isTextVisible3 ? "max-h-screen" : "max-h-0"
            }`}
          >
            <p className=" font-bold"> Registro Simples</p>
            <p className=" mb-2">
              Junte-se à Sos Travelers com um simples processo de registro para
              hostels.
            </p>
            <p className=" font-bold"> Personalização de Serviços</p>
            <p className=" mb-2">
              Escolha os serviços que melhor se adequam às preferências e estilo
              do seu hostel e fortaleça sua oferta. Aumente a satisfação de seus
              hóspedes ao oferecer serviços exclusivos e personalizados por meio
              da Sos Travelers, com controle total 24 horas. Com seu registro,
              você poderá marcar seus dias e horários disponíveis, ver os
              serviços agendados, as comissões geradas e obter informações sobre
              nossos colaboradores.
            </p>
          </div>
        </div>
      </div>

      <p className="text-left mt-2 mb-5 font-bold mx-4">Team Sos travelers</p>

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
