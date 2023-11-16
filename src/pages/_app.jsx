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
      router.pathname !== "/worker/my-services"
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
