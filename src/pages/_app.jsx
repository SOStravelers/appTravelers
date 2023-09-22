import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Layout from "../layouts/Layout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import awsmobile from "@/aws-exports";
import { Amplify } from "aws-amplify";

console.log({
  ...awsmobile,
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: "https://dev.sostvl.com/alternative-login",
    redirectSignOut: "https://dev.sostvl.com/alternative-login",
  },
});

Amplify.configure({
  ...awsmobile,
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: "https://dev.sostvl.com/alternative-login",
    redirectSignOut: "https://dev.sostvl.com/alternative-login",
  },
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const renderNavbar = () => {
    if (
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/alternative-login" &&
      router.pathname !== "/intro"
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
