import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Layout from "../layouts/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";

Amplify.configure({
  ...awsmobile,
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: "https://dev.sostvl.com/alternative-login/",
    redirectSignOut: "https://dev.sostvl.com/alternative-login/",
  },
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    // This code runs on the client side after the component is mounted
    const isLocalhost = window.location.hostname.includes("localhost");
    const redirectSignIn = isLocalhost
      ? "http://localhost:3000/alternative-login/"
      : "https://dev.sostvl.com/alternative-login/";

    const redirectSignOut = isLocalhost
      ? "http://localhost:3000/alternative-login/"
      : "https://dev.sostvl.com/alternative-login/";

    // Use redirectSignIn and redirectSignOut as needed
    //console.log({ redirectSignIn, redirectSignOut });
    Amplify.configure({
      ...awsmobile,
      // oauth: {
      //   ...awsmobile.oauth,
      //   redirectSignIn,
      //   redirectSignOut,
      // },
    });
  }, []);

  const renderNavbar = () => {
    if (
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/alternative-login" &&
      router.pathname !== "/intro" &&
      router.pathname !== "/terms-of-service" &&
      router.pathname !== "/guest-settings"
    ) {
      return <Navbar />;
    }
  };

  return (
    <Layout>
      <ToastContainer position="top-center" theme="dark" />
      <Component {...pageProps} />
      {renderNavbar()}
    </Layout>
  );
}
