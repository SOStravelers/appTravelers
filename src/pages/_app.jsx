import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Layout from "../layouts/Layout";
import Sidebar from "@/components/layout/Sidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";

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
  }, []);

  const renderNavbar = () => {
    if (
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/alternative-login" &&
      router.pathname !== "/intro" &&
      router.pathname !== "/terms-of-service" &&
      router.pathname !== "/guest-settings" &&
      router.pathname !== "/payment" &&
      router.pathname !== "/stripe" &&
      router.pathname !== "/paypal"
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

  return (
    <Layout>
      {renderSidebar()}
      <ToastContainer position="top-center" theme="dark" />
      <Component {...pageProps} />
      {renderNavbar()}
    </Layout>
  );
}
