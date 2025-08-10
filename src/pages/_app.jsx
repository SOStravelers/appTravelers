import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "../layouts/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleOneTap from "@/hooks/GoogleOneTap";
import { renderToString } from "react-dom/server";
import { LogoSosRelleno, LogoSosWhite } from "@/constants/icons";
import Script from "next/script";
import GoogleAnalytics from "@bradgarropy/next-google-analytics";
import Cookies from "js-cookie";
import { alertError } from "@/utils/alerts.jsx";
globalThis.alertError = alertError;
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  /* -------- tema oscuro -------- */
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const cookieTheme = Cookies.get("theme");
    if (cookieTheme === "dark") root.classList.add("dark");
    else if (cookieTheme === "light") root.classList.remove("dark");
    else darkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [darkMode]);

  const svgString = darkMode
    ? renderToString(<LogoSosWhite />)
    : renderToString(<LogoSosRelleno />);

  /* -------- SEO / indexación -------- */
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

  /* -------- render -------- */
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

      {/* /share/[id] no usa Layout */}
      {Component.noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout lang={lang}>
          <ToastContainer
            position="top-right"
            theme="dark"
            containerId="bulk"
          />
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
