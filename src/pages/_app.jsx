import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Head from "next/head";
import Layout from "../layouts/Layout";
import Sidebar from "@/components/layout/Sidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationService from "@/services/NotificationService";
import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";
import { LogoSosRelleno } from "@/constants/icons";
// Importa las funciones necesarias para renderizar el SVG a cadena
import { renderToString } from "react-dom/server";
import { routesNavbar, routesSidebar } from "@/utils/variables";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  console.log("prueba");
  // useEffect(() => {
  //   console.log("buenas tardes");
  //   if ("serviceWorker" in navigator) {
  //     console.log("Service Worker is supported");
  //     const registerServiceWorker = () => {
  //       navigator.serviceWorker.register("/sw.js").then(
  //         function (registration) {
  //           console.log(
  //             "Service Worker registration successful with scope: ",
  //             registration.scope
  //           );
  //           // Solicitar permiso para enviar notificaciones
  //           console.log("vamos a los permisos");
  //           Notification.requestPermission().then(async function (permission) {
  //             if (permission === "granted") {
  //               console.log("Notification permission granted.");
  //               // Suscribirse a las notificaciones push
  //               const responsePublicKey =
  //                 await NotificationService.getPublicKey();
  //               console.log(
  //                 "vamos a la suscripcion",
  //                 responsePublicKey.data.publicKey
  //               );
  //               const data = responsePublicKey.data;
  //               if (!data) {
  //                 console.log("No se pudo obtener la clave pública");
  //                 return;
  //               }
  //               const publicKey = urlBase64ToUint8Array(data.publicKey);
  //               registration.pushManager
  //                 .subscribe({
  //                   userVisibleOnly: true,
  //                   applicationServerKey: publicKey,
  //                 })
  //                 .then(async function (subscription) {
  //                   console.log("se viene la subcripcion", subscription);
  //                   await NotificationService.createSub(subscription);
  //                 });
  //             } else {
  //               console.log("Unable to get permission to notify.");
  //             }
  //           });
  //         },
  //         function (err) {
  //           console.log("Service Worker registration failed: ", err);
  //         }
  //       );
  //     };

  //     if (document.readyState === "complete") {
  //       registerServiceWorker();
  //     } else {
  //       window.addEventListener("load", registerServiceWorker);
  //     }
  //   }
  // }, []);

  // function urlBase64ToUint8Array(base64String) {
  //   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/-/g, "+")
  //     .replace(/_/g, "/");
  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);
  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-RP0PLGCYV9");

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

  // Lista de rutas que quieres indexar
  const indexableRoutes = [
    "/",
    "/login",
    "/register",
    "/terms-of-service",
    "/use-policy",
  ];

  // Lista de dominios que quieres indexar
  const indexableDomains = [
    "https://sostvl.com",
    "https://business.sostvl.com",
  ];

  // Verifica si la ruta actual debe ser indexada
  const shouldIndex = indexableRoutes.includes(router.pathname);

  // Verifica si el dominio actual debe ser indexado
  const shouldIndexDomain =
    typeof window !== "undefined" &&
    indexableDomains.includes(window.location.origin);
  return (
    <>
      <Head>
        {/* Agrega el logo en el encabezado */}
        {!shouldIndex || !shouldIndexDomain ? (
          <meta name="robots" content="noindex" />
        ) : null}
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
