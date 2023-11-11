import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { getSession } from "next-auth/react";
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
  const { setWorker, isWorker } = useStore();
  const { loggedIn, user, setUser, setLoggedIn } = useStore();
  useEffect(() => {
    if (!user || Object.keys(user).length == 0) {
      obtenerInformacionUsuario();
    }
  }, []);

  async function obtenerInformacionUsuario() {
    try {
      let user = JSON.parse(localStorage.getItem("auth.user"));
      let idUser = localStorage.getItem("auth.user_id");
      let type = localStorage.getItem("type");
      if (type && type == "worker") {
        setWorker(true);
      }
      if (user) {
        console.log("sesion activa");
        setUser(user);
        setLoggedIn(true);
      } else if (idUser) {
        console.log("recuperando sesion");
        try {
          UserService.get(storageUser).then((response) => {
            console.log("response.data", response.data);
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
    } catch (err) {
      console.log("deslogueando por error");
      console.error("Error al obtener la información del usuario:", err);
      setUser(null);
      setLoggedIn(false);
    }
  }

  // async function loginGoogle() {
  //   try {
  //     const result = await fetch("/api/getUserInfo");
  //     console.log(result); // Reemplaza esto con la URL correcta de tu API
  //     const userInfo = await result.json();
  //     const response = await UserService.loginGoogle(
  //       userInfo.name,
  //       userInfo.email,
  //       userInfo.image
  //     );
  //     if (response) {
  //       setUser(response.data.user);
  //       setLoggedIn(true);
  //       localStorage.setItem("auth.access_token", response.data.access_token);
  //       localStorage.setItem("auth.refresh_token", response.data.refresh_token);
  //       localStorage.setItem("auth.user_id", response.data.user._id);
  //       localStorage.setItem("auth.user", JSON.stringify(response.data.user));
  //       Cookies.set("auth.access_token", response.data.access_token);
  //       Cookies.set("auth.refresh_token", response.data.refresh_token);
  //       Cookies.set("auth.user_id", response.data.user._id);
  //       Cookies.set("auth.user", JSON.stringify(response.data.user));
  //     }
  //   } catch (err) {}
  // }

  const isLoginPage =
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/alternative-login";

  console.log("wena", router.pathname);
  const arePrincipalPages =
    router.pathname === "/worker/booking" ||
    router.pathname === "/worker/profile" ||
    router.pathname === "/worker/home" ||
    router.pathname === "/" ||
    router.pathname === "/worker/chat" ||
    router.pathname === "/worker/favorites" ||
    router.pathname === "/booking" ||
    router.pathname === "/chat" ||
    router.pathname === "/favorites" ||
    router.pathname === "/profile";

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
