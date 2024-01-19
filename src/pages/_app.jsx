import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Head from "next/head";
import Layout from "../layouts/Layout";
import Sidebar from "@/components/layout/Sidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";
import { LogoSosRelleno } from "@/constants/icons";
// Importa las funciones necesarias para renderizar el SVG a cadena
import { renderToString } from "react-dom/server";
import { routesNavbar, routesSidebar } from "@/utils/variables";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const renderNavbar = () => {
    if (routesNavbar(router)) {
      return <Navbar />;
    }
  };

  const renderSidebar = () => {
    if (routesSidebar(router)) {
      return <Sidebar />;
    }
  };
  // Convierte el componente SVG a cadena
  const svgString = renderToString(<LogoSosRelleno />);
  let lang;
  if (typeof window !== "undefined") {
    lang = window.navigator.userLanguage || window.navigator.language;
  }
  return (
    <>
      <Head>
        {/* Agrega el logo en el encabezado */}
        <link
          rel="icon"
          href={`data:image/svg+xml,${encodeURIComponent(svgString)}`}
          type="image/svg+xml"
        />
        {/* Establece el título de la página */}
        <title>{router.asPath ? router.asPath : "SOS Travelers"}</title>
      </Head>
      <Layout lang={lang}>
        {renderSidebar()}
        <ToastContainer position="top-center" theme="dark" />
        <Component {...pageProps} />
        {renderNavbar()}
      </Layout>
    </>
  );
}
