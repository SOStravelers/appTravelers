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
import { renderToString } from "react-dom/server";
import { LogoSosRelleno } from "@/constants/icons";
import { routesNavbar, routesSidebar } from "@/utils/variables";
import Script from "next/script";
import GoogleAnalytics from "@bradgarropy/next-google-analytics";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  /* ---------- helpers layout ---------- */
  const renderNavbar = () => routesNavbar(router) && <Navbar />;
  const renderSidebar = () => routesSidebar(router) && <Sidebar />;

  /* ---------- favicon dinámico ---------- */
  const svgString = renderToString(<LogoSosRelleno />);

  /* ---------- robots: noindex en rutas/dom. ---------- */
  const indexableRoutes = [
    "/",
    "/login",
    "/register",
    "/terms-of-service",
    "/use-policy",
  ];
  const indexableDomains = [
    "https://sostvl.com",
    "https://business.sostvl.com",
  ];

  const shouldIndexRoute = indexableRoutes.includes(router.pathname);
  const shouldIndexDomain =
    typeof window !== "undefined" &&
    indexableDomains.includes(window.location.origin);

  const lang =
    typeof window !== "undefined"
      ? window.navigator.userLanguage || window.navigator.language
      : undefined;

  return (
    <>
      <Head>
        {!shouldIndexRoute || !shouldIndexDomain ? (
          <meta name="robots" content="noindex" />
        ) : null}
        <link
          rel="icon"
          href={`data:image/svg+xml,${encodeURIComponent(svgString)}`}
          type="image/svg+xml"
        />
        <title>{router.asPath || "SOS Travelers"}</title>
      </Head>

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-RP0PLGCYV9"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RP0PLGCYV9');
        `}
      </Script>
      <GoogleAnalytics measurementId="G-RP0PLGCYV9" />

      {/* Layout + único contenedor de toasts */}
      <Layout lang={lang}>
        {renderSidebar()}
        <ToastContainer position="top-right" theme="dark" containerId="bulk" />
        <Component {...pageProps} />
        {renderNavbar()}
      </Layout>
    </>
  );
}
