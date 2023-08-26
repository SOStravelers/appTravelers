import "@/styles/globals.css";
import { useRouter } from "next/router";
import Navbar from "@/components/layout/Navbar";
import Layout from "./layouts/Layout";

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
      <Component {...pageProps} />
      {renderNavbar()}
    </Layout>
  );
}
