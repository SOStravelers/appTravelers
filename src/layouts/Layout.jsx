import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import { useStore } from "@/store";
import TextModal from "@/components/utils/modal/TextModal";
import Head from "next/head";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import TopBarSubMenu from "@/components/layout/TopBarSubMenu";
import clsx from "clsx";
import { ThreeDots } from "react-loader-spinner";
import { LogoSosBlack, LogoSosRelleno } from "@/constants/icons";

import { Poppins } from "next/font/google";
import { CustomMiddlewareComponent } from "@/middleware";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function Layout({ children, lang }) {
  const router = useRouter();
  const { socket } = useStore();
  const [middlewareCompleted, setMiddlewareCompleted] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [booking, setBooking] = useState({});
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  const handleMiddlewareComplete = () => {
    // Esta función se llamará desde CustomMiddlewareComponent
    // cuando sus funciones hayan terminado.
    setMiddlewareCompleted(true);
  };
  const stateBookingWorker = async () => {
    console.log("stateBookingWorker");
    router.push(`/service-details/${booking._id}`);
  };
  const cancelWorkerModal = async () => {
    console.log("cancelWorkerModal");
    setOpenWorkerModal(false);
  };
  useEffect(() => {
    console.log("socket.current", socket);

    if (socket && socket.current) {
      console.log("recibiendo desde a chatContainer comp");
      socket.current.on("booking-recieve", (data) => {
        console.log("booking recibido", data);
        setBooking(data.data);
        setOpenWorkerModal(true);
      });
    }
  }, [socket]);

  let metaDescription = "";
  const language = lang ? lang : "en";
  if (language.includes("fr")) {
    metaDescription =
      "Découvrez un bien-être personnalisé : choisissez votre hostel, choisissez l'heure et trouvez des professionnels d'élite dans notre application conviviale. Des travailleurs soigneusement sélectionnés pour une expérience inégalée. Votre confort est notre priorité !";
  } else if (language.includes("pt")) {
    metaDescription =
      "Descubra o bem-estar personalizado: escolha seu hostel, escolha o horário e encontre profissionais de elite em nosso amigável aplicativo. Trabalhadores cuidadosamente selecionados para uma experiência incomparável. Seu conforto é nossa prioridade!";
  } else if (language.includes("es")) {
    metaDescription =
      "Descubre el bienestar personalizado: elige tu hostel, elige el horario y encuentra profesionales de élite en nuestra amigable aplicación. Trabajadores cuidadosamente seleccionados para una experiencia inigualable. ¡Su comodidad es nuestra prioridad!";
  } else {
    metaDescription =
      "Discover personalized well-being: choose your hostel, pick the time, and find elite professionals in our friendly app. Carefully selected workers for an unparalleled experience. Your comfort is our priority!";
  }

  const isLoginPage =
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/create-user-password" ||
    router.pathname === "/alternative-login";

  const arePrincipalPages =
    router.pathname === "/worker/booking" ||
    router.pathname === "/worker/profile" ||
    router.pathname === "/worker/home" ||
    router.pathname === "/" ||
    router.pathname === "/worker/requests" ||
    router.pathname === "/worker/chat" ||
    router.pathname === "/worker/favorites" ||
    router.pathname === "/booking" ||
    router.pathname === "/chat" ||
    router.pathname === "/favorites" ||
    router.pathname === "/profile" ||
    router.pathname === "/payment-confirmation" ||
    router.pathname === "/guest-settings";

  const isIntro = router.pathname === "/intro";

  const isPaymentConfirm = router.pathname === "/payment-confirmation";

  return (
    <>
      <div className={clsx("relative", poppins.className)}>
        <CustomMiddlewareComponent
          onMiddlewareComplete={handleMiddlewareComplete}
        />
        <Head>
          <title>Sos Travelers</title>
          <meta name="description" content={metaDescription} />

          {/* Redes sociales */}
          <meta property="og:title" content="SOS Travelers" />
          <meta property="og:description" content={metaDescription} />

          <meta
            property="og:image"
            content={`https://sostvl.com/assets/logoRedes.png?random=${Math.random()}`}
          />
        </Head>
        {middlewareCompleted ? (
          <>
            {isLoginPage ? (
              <WaveBar />
            ) : arePrincipalPages ? (
              <TopBar />
            ) : (
              !isIntro && !isPaymentConfirm && <TopBarSubMenu />
            )}
            <TextModal
              title={"Parabéns!!, você tem uma nova reserva"}
              text={[
                `Lugar: ${booking?.businessUser?.businessData?.name}`,
                `Data: ${booking?.date?.stringData} | ${booking?.startTime?.stringData}`,
              ]}
              textCancel="Voltar"
              colorAceptButton={dataModal?.colorAceptButton}
              buttonText={"Veja a reserva"}
              open={openWorkerModal}
              setOpen={setOpenWorkerModal}
              onAccept={stateBookingWorker}
              onCancel={cancelWorkerModal}
            />
            {children}
          </>
        ) : (
          <div className="w-sreen flex flex-col h-screen  items-center justify-center">
            <LogoSosRelleno></LogoSosRelleno>
            <p className=" font-medium mt-4 text-xl">SOS Travelers</p>
            <ThreeDots
              wrapperStyle={{ marginTop: "-25px" }}
              width={100}
              height={100}
              color="black"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Layout;
