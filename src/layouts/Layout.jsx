import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import clsx from "clsx";
import LoaderGlobal from "@/components/layout/loaderGlobal";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import TopBarSubMenu from "@/components/layout/TopBarSubMenu";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Head from "next/head";
import {
  isLoginPage,
  arePrincipalPages,
  routesNavbar,
  routesSidebar,
} from "@/utils/variables";
import { Poppins } from "next/font/google";
import { CustomMiddlewareComponent } from "@/middleware";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import OfflineScreen from "@/components/layout/OfflineScreen";
import languageData from "@/language/layout.json";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function Layout({ children, lang }) {
  const router = useRouter();
  const [middlewareCompleted, setMiddlewareCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();

  const handleMiddlewareComplete = () => setMiddlewareCompleted(true);

  // 👇 Esta animación corre cada vez que cambia de ruta
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false), 250);
  }, [router.asPath]);

  const language = ["pt", "es", "de", "fr", "en"].includes(lang) ? lang : "en";
  const metaDescription = languageData.metaDescription[language] || "";

  const isIntro = router.pathname === "/intro";
  const isPaymentConfirm = router.pathname === "/payment-confirmation";
  const showNavbar = routesNavbar(router);
  const showSidebar = routesSidebar(router);

  return (
    <div className={clsx("relative", poppins.className)}>
      <CustomMiddlewareComponent
        onMiddlewareComplete={handleMiddlewareComplete}
      />

      <Head>
        <title>SOS Travelers</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content="SOS Travelers" />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content={`https://sostvl.com/assets/logoRedes.png?random=${Math.random()}`}
        />
      </Head>

      {!middlewareCompleted || !isOnline ? (
        <LoaderGlobal />
      ) : (
        <>
          {isLoginPage(router) ? (
            <WaveBar />
          ) : arePrincipalPages(router) ? (
            <TopBar />
          ) : (
            !isIntro && !isPaymentConfirm && <TopBarSubMenu />
          )}

          {router.pathname !== "/" && (
            <div className="h-16 md:h-20 bg-backgroundP" />
          )}

          {showSidebar && <Sidebar />}

          {/* 🟢 Animación al montar cada página */}

          {children}

          {showNavbar && <Navbar />}
        </>
      )}

      {!isOnline && <OfflineScreen />}
    </div>
  );
}

export default Layout;
