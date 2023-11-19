import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";

export const CustomMiddlewareComponent = () => {
  const router = useRouter();
  const store = useStore();
  const { user, setUser, setLoggedIn, service } = store;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || Object.keys(user).length == 0) {
        await obtenerInformacionUsuario();
      }
      routeValidation();
    };

    fetchData();
  }, [router.pathname]);

  const routeValidation = async () => {
    var shouldRedirect = true;
    if (router.pathname.includes("worker") && !isWorker) {
      shouldRedirect = false;
    }
    if (
      !user &&
      (router.pathname == "/profile" ||
        router.pathname == "/personal-details" ||
        router.pathname == "/settings" ||
        router.pathname == "/payment" ||
        router.pathname == "/stripe")
    ) {
      shouldRedirect = false;
    }
    if (!shouldRedirect) {
      router.push("/");
    }
  };

  const obtenerInformacionUsuario = async () => {
    let storageUser = localStorage.getItem("auth.user");
    if (storageUser && Object.keys(storageUser).length > 0) {
      setUser(storageUser);
      setLoggedIn(true);
    }
    try {
      console.log("google search");
      const result = await fetch("/api/getUserInfo");
      if (result.ok) {
        localStorage.setItem("auth.google", true);
        const userInfo = await result.json();
        const response = await UserService.loginGoogle(
          userInfo.name,
          userInfo.email,
          userInfo.image
        );
        if (response) {
          console.log("la respuestaaaa", response.data);
          delete response.data.user.type;
          localStorage.setItem("auth.access_token", response.data.access_token);
          localStorage.setItem(
            "auth.refresh_token",
            response.data.refresh_token
          );
          localStorage.setItem("auth.user_id", response.data.user._id);
          localStorage.setItem("auth.user", JSON.stringify(response.data.user));
          Cookies.set("auth.access_token", response.data.access_token);
          Cookies.set("auth.refresh_token", response.data.refresh_token);
          Cookies.set("auth.user_id", response.data.user._id);
          setUser(response.data.user);
          setLoggedIn(true);
          if (router.pathname == "/login" || router.pathname == "/register") {
            if (service && Object.keys(service).length > 0)
              router.push(`/summary`);
            else router.push("/");
          } else if (
            (router.pathname =
              "/booking" ||
              router.pathname == "/favorites" ||
              router.pathname == "/chat")
          ) {
            router.push("/");
          }
        }
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };

  return null; // Este componente no renderiza nada
};
