import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import TopBarSubMenu from "@/components/layout/TopBarSubMenu";
import clsx from "clsx";
import UserService from "@/services/UserService";
import Cookies from "js-cookie";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function Layout({ children }) {
  const router = useRouter();
  const { loggedIn, user, setUser, setLoggedIn } = useStore();
  useEffect(() => {
    if (!user || Object.keys(user).length == 0) {
      obtenerInformacionUsuario();
    }
  }, []);

  async function obtenerInformacionUsuario() {
    let storageUser = localStorage.getItem("auth.user_id");
    console.log("sss", storageUser);
    if (storageUser && Object.keys(storageUser).length > 0) {
      console.log("loguando");
      try {
        console.log("casa");
        UserService.get(storageUser).then((response) => {
          console.log("response.data", response.data);
          localStorage.setItem("auth.user_id", response.data._id);
          localStorage.setItem("auth.user", response.data);
          Cookies.set("auth.user_id", response.data._id);
          Cookies.set("auth.user", response.data);
          setUser(response.data);
          setLoggedIn(true);
        });
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    } else {
      console.log("deslogueando");
      setUser(null);
      setLoggedIn(false);
    }
  }

  console.log("layout");
  const isLoginPage =
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/alternative-login";

  const arePrincipalPages =
    router.pathname === "/booking" ||
    router.pathname === "/chat" ||
    router.pathname === "/favorites" ||
    router.pathname === "/profile" ||
    router.pathname === "/" ||
    router.pathname === "/worker/home" ||
    router.pathname === "/worker/booking";

  const isIntro = router.pathname === "/intro";

  const isPaymentConfirm = router.pathname === "/payment-confirmation";

  return (
    <>
      <div className={clsx("relative", poppins.className)}>
        {isLoginPage ? (
          <WaveBar />
        ) : arePrincipalPages ? (
          <TopBar />
        ) : (
          !isIntro && !isPaymentConfirm && <TopBarSubMenu />
        )}
        {children}
      </div>
    </>
  );
}

export default Layout;
