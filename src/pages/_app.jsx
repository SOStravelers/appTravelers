import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Head from "next/head";
import Layout from "../layouts/Layout";
import Sidebar from "@/components/layout/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleOneTap from "@/hooks/GoogleOneTap";
import { renderToString } from "react-dom/server";
import { LogoSosRelleno } from "@/constants/icons";
import { routesNavbar, routesSidebar } from "@/utils/variables";
import Script from "next/script";
import GoogleAnalytics from "@bradgarropy/next-google-analytics";
import Cookies from "js-cookie";

export default function App({ Component, pageProps }) {
  console.log("inicio");
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const renderNavbar = () => routesNavbar(router) && <Navbar />;
  const renderSidebar = () => routesSidebar(router) && <Sidebar />;

  const svgString = renderToString(<LogoSosRelleno />);

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
  //minicambio
  const shouldIndexRoute = indexableRoutes.includes(router.pathname);
  const shouldIndexDomain =
    typeof window !== "undefined" &&
    indexableDomains.includes(window.location.origin);

  const lang =
    typeof window !== "undefined"
      ? window.navigator.userLanguage || window.navigator.language
      : undefined;

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark); // ← esta línea faltaba
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let cookieTheme = Cookies.get("theme");
    if (cookieTheme && cookieTheme == "dark") {
      root.classList.add("dark");
      return;
    }
    if (cookieTheme && cookieTheme == "light") {
      root.classList.remove("dark");
      return;
    }
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <>
      <GoogleOneTap />
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

      {/* Si es /share/[id] → no usar Layout */}
      {Component.noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout lang={lang}>
          <ToastContainer
            position="top-right"
            theme="dark"
            containerId="bulk"
          />
          {renderSidebar()}
          <Component {...pageProps} />
          {renderNavbar()}
        </Layout>
      )}
    </>
  );
}
