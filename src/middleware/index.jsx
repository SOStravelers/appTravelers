import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { getSession } from "next-auth/react";

export const CustomMiddlewareComponent = () => {
  const router = useRouter();
  const store = useStore();
  const { user, setUser, setLoggedIn, isWorker, setWorker, setLoginModal } =
    store;

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
    console.log("validar", isWorker);

    if (
      router.pathname.includes("worker") &&
      !isWorker &&
      router.pathname != "/workers-found/[id]" &&
      router.pathname != "/worker/[id]"
    ) {
      router.push("/");
    } else if (
      !user &&
      (router.pathname == "/profile" ||
        router.pathname == "/personal-details" ||
        router.pathname == "/payment-confirmation" ||
        router.pathname == "/settings" ||
        router.pathname == "/payment" ||
        router.pathname == "/stripe")
    ) {
      router.push("/");
    } else if (
      user &&
      Object.keys(user).length > 0 &&
      isWorker &&
      (router.pathname == "/" ||
        router.pathname == "/profile" ||
        router.pathname == "/chat" ||
        router.pathname == "/favorites" ||
        router.pathname == "/personal-details" ||
        router.pathname == "/settings" ||
        router.pathname == "/payment" ||
        router.pathname == "/stripe")
    ) {
      router.push("/worker/home");
    } else if (
      user &&
      Object.keys(user).length > 0 &&
      (router.pathname == "/login" || router.pathname == "/register")
    ) {
      router.push("/");
    }
  };

  const obtenerInformacionUsuario = async () => {
    console.log("get Info", user);
    if (user && Object.keys(user).length > 0) {
      console.log("ya hay usuario");
      return;
    }
    let cookieAccessToken = Cookies.get("auth.access_token");
    let typeWorker = localStorage.getItem("type");
    if (cookieAccessToken) {
      console.log("set user back");
      const user = await UserService.getUserById();
      if (user) {
        Cookies.set("auth.user_id", user.data._id);
        // if (process.env.NODE_ENV == "production" || typeWorker) {
        //   localStorage.setItem("type", user.data.type);
        //   typeWorker && typeWorker == "worker"
        //     ? setWorker(true)
        //     : setWorker(false);
        // }
        setUser(user.data);
        setLoggedIn(true);
        setLoginModal(true);
      } else {
        setLoggedIn(false);
        return;
      }
    } else {
      try {
        const session = await getSession();
        if (session) {
          console.log("hay sesion google");
          const response = await UserService.loginGoogle(
            session.user.name,
            session.user.email,
            session.user.image
          );
          if (response) {
            Cookies.set("auth.access_token", response.data.access_token);
            Cookies.set("auth.refresh_token", response.data.refresh_token);
            Cookies.set("auth.user_id", response.data.user._id);

            // if (process.env.NODE_ENV === "production" || typeWorker) {
            //   localStorage.setItem("type", user.data.type);
            //   typeWorker && typeWorker == "worker"
            //     ? setWorker(true)
            //     : setWorker(false);
            // }
            setLoggedIn(true);
            setLoginModal(true);
            setUser(response.data.user);
            router.push("/");
          }
        } else {
          console.log("no hay nada");
          setLoggedIn(false);
          return;
        }
      } catch (error) {
        console.error("Eno hay usuario");
        return;
      }
    }
  };

  return null; //Este componente no renderiza nada
};
