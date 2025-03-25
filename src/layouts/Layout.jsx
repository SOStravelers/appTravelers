import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import Head from "next/head";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import TopBarSubMenu from "@/components/layout/TopBarSubMenu";
import clsx from "clsx";
import { ThreeDots } from "react-loader-spinner";
import { LogoSosBlack, LogoSosRelleno } from "@/constants/icons";
import { isLoginPage, arePrincipalPages } from "@/utils/variables";
import { Poppins } from "next/font/google";
import { CustomMiddlewareComponent } from "@/middleware";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function Layout({ children, lang }) {
  const router = useRouter();

  const [middlewareCompleted, setMiddlewareCompleted] = useState(false);

  const handleMiddlewareComplete = () => {
    // Esta función se llamará desde CustomMiddlewareComponent
    // cuando sus funciones hayan terminado.
    setMiddlewareCompleted(true);
  };
  // const { socket } = useStore();

  let metaDescription = "";

  let newLang = "en";
  if (
    lang == "pt" ||
    lang == "es" ||
    lang == "de" ||
    lang == "en" ||
    lang == "fr"
  ) {
    newLang = lang;
  }
  const language = newLang ? newLang : "en";
  if (language.includes("fr")) {
    metaDescription =
      "Découvrez le meilleur de Rio de Janeiro : réservez des expériences uniques, des visites, des plats locaux et même des billets pour le stade, le tout dans une seule application conviviale. Explorez Rio comme jamais auparavant !";
  } else if (language.includes("pt")) {
    metaDescription =
      "Descubra o melhor do Rio de Janeiro: reserve experiências incríveis, passeios, comidas locais e até ingressos para o estádio — tudo em um só app. Explore o Rio como nunca antes!";
  } else if (language.includes("es")) {
    metaDescription =
      "Descubre lo mejor de Río de Janeiro: reserva experiencias increíbles, tours, comida local e incluso entradas para el estadio, todo desde una sola aplicación. ¡Explora Río como nunca antes!";
  } else {
    metaDescription =
      "Discover the best of Rio de Janeiro: book amazing experiences, tours, local food, and even stadium tickets — all in one friendly app. Explore Rio like never before!";
  }

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
            {isLoginPage(router) ? (
              <WaveBar />
            ) : arePrincipalPages(router) ? (
              <TopBar />
            ) : (
              !isIntro && !isPaymentConfirm && <TopBarSubMenu />
            )}

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
