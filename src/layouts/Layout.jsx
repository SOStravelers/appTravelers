import { useRouter } from "next/router";
import { useState } from "react";
import LoaderGlobal from "@/components/layout/loaderGlobal";
import Head from "next/head";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import TopBarSubMenu from "@/components/layout/TopBarSubMenu";
import clsx from "clsx";
import { isLoginPage, arePrincipalPages } from "@/utils/variables";
import { Poppins } from "next/font/google";
import { CustomMiddlewareComponent } from "@/middleware";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import OfflineScreen from "@/components/layout/OfflineScreen";
import languageData from "@/language/layout.json";
console.log("empieza layout");
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function Layout({ children, lang }) {
  const router = useRouter();
  const [middlewareCompleted, setMiddlewareCompleted] = useState(false);
  //Para saber si está online
  const isOnline = useOnlineStatus();
  //manejador de autenticacion de usuario
  const handleMiddlewareComplete = () => {
    // cuando sus funciones hayan terminado.
    setMiddlewareCompleted(true);
  };

  // const { socket } = useStore();

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
  const language = newLang;
  let metaDescription = "";
  metaDescription = languageData.metaDescription[language];

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
            {/* salto por el menu de arriba */}
            {router.pathname != "/" && (
              <div className="h-16 md:h-20 bg-backgroundP"></div>
            )}
            {children}
          </>
        ) : (
          <LoaderGlobal />
        )}
      </div>
    </>
  );
}
export default Layout;
