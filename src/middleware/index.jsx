import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { getSession } from "next-auth/react";

export const CustomMiddlewareComponent = () => {
  const router = useRouter();
  const store = useStore();
  const {
    user,
    setUser,
    setLoggedIn,
    service,
    isWorker,
    setWorker,
    loginModal,
    setLoginModal,
  } = store;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || Object.keys(user).length == 0) {
        await obtenerInformacionUsuario();
      }
      routeValidation();
    };

    fetchData();
  }, [router.pathname, user]);

  const routeValidation = async () => {
    console.log(
      "validar",
      router.pathname.includes("worker"),
      !isWorker,
      router.pathname.includes("workers-found")
    );
    console.log(router.pathname);
    var shouldRedirect = true;
    if (
      router.pathname.includes("worker") &&
      !isWorker &&
      router.pathname != "/workers-found/[id]" &&
      router.pathname != "/worker/[id]"
    ) {
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
      console.log("perro2");
      shouldRedirect = false;
    }
    if (!shouldRedirect) {
      console.log("revalidar");
      router.push("/");
    }
  };

  const obtenerInformacionUsuario = async () => {
    console.log("obtener informacion", isWorker);
    let storageUser = localStorage.getItem("auth.user");
    let storageType = localStorage.getItem("type");
    if (storageUser && Object.keys(storageUser).length > 0) {
      console.log("entrando 1");
      console.log(storageType);
      console.log(JSON.parse(storageUser));
      setUser(JSON.parse(storageUser));
      setLoggedIn(true);
      if (storageType && storageType == "worker") {
        console.log("entradn");
        setWorker(true);
      }
    } else {
      try {
        console.log("cagazo");
        const session = await getSession();
        console.log("sesion", session);
        if (session) {
          const response = await UserService.loginGoogle(
            session.user.name,
            session.user.email,
            session.user.image
          );
          if (response) {
            console.log(response);
            delete response.data.user.type;
            localStorage.setItem(
              "auth.access_token",
              response.data.access_token
            );
            localStorage.setItem(
              "auth.refresh_token",
              response.data.refresh_token
            );
            localStorage.setItem("auth.user_id", response.data.user._id);
            localStorage.setItem(
              "auth.user",
              JSON.stringify(response.data.user)
            );
            Cookies.set("auth.access_token", response.data.access_token);
            Cookies.set("auth.refresh_token", response.data.refresh_token);
            Cookies.set("auth.user_id", response.data.user._id);
            setUser(response.data.user);
            setLoggedIn(true);
            setLoginModal(true);
            if (router.pathname == "/login" || router.pathname == "/register") {
              if (service && Object.keys(service).length > 0)
                router.push(`/summary`);
              else router.push("/");
            }
          }
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    }
  };

  return null; // Este componente no renderiza nada
};
