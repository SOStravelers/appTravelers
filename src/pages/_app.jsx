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

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const renderNavbar = () => {
    if (
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/alternative-login" &&
      router.pathname !== "/intro" &&
      router.pathname !== "/terms-of-service" &&
      router.pathname !== "/payment" &&
      router.pathname !== "/stripe" &&
      router.pathname !== "/paypal" &&
      router.pathname !== "/worker/my-schedules" &&
      router.pathname !== "/worker/settings" &&
      router.pathname !== "/settings" &&
      router.pathname !== "/personal-details" &&
      router.pathname !== "/change-password" &&
      router.pathname !== "/create-password" &&
      router.pathname !== "/worker/profile-config" &&
      router.pathname !== "/worker/my-services" &&
      !router.pathname.includes("chat/")
    ) {
      return <Navbar />;
    }
  };

  const renderSidebar = () => {
    if (
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/alternative-login" &&
      router.pathname !== "/intro"
    ) {
      return <Sidebar />;
    }
  };
  // Convierte el componente SVG a cadena
  const svgString = renderToString(<LogoSosRelleno />);

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
      <Layout>
        {renderSidebar()}
        <ToastContainer position="top-center" theme="dark" />
        <Component {...pageProps} />
        {renderNavbar()}
      </Layout>
    </>
  );
}
