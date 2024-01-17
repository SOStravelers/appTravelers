import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import { useStore } from "@/store";
import { getSession } from "next-auth/react";

export const CustomMiddlewareComponent = ({ onMiddlewareComplete }) => {
  const router = useRouter();
  const store = useStore();
  // const user = Cookies.get("auth.user");
  const {
    user,
    setUser,
    setLoggedIn,
    isWorker,
    service,
    setWorker,
    setLoginModal,
  } = store;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || Object.keys(user).length == 0) {
        await obtenerInformacionUsuario();
      }
      // await routeValidation();
      setTimeout(() => {
        onMiddlewareComplete();
      }, 500);
    };

    fetchData();
  }, [onMiddlewareComplete]);

  const obtenerInformacionUsuario = async () => {
    // console.log("middleware");
    let cookieAccessToken = Cookies.get("auth.access_token");
    const session = await getSession();
    if (user && Object.keys(user).length > 0) {
      // console.log("ya hay usuario");
      return;
    }
    let route = router.pathname;
    // console.log("route", route, route == "/forgot-password");
    if (route == "/login") {
      // console.log("caso login");
      if (
        (!user || Object.keys(user).length == 0) &&
        !cookieAccessToken &&
        !session
      ) {
        // console.log("no hay usuario");
        return;
      } else {
        router.push("/");
      }
    } else if (
      route == "/forgot-password" ||
      route == "/change-password" ||
      route == "/recovery-password"
    ) {
      // console.log("caso libre");
      return;
    } else {
      // console.log("caso else");
      if (!user || Object.keys(user).length == 0) {
        // console.log("no hay usuario");

        if (cookieAccessToken) {
          // console.log("set user back");
          const user = await UserService.getUserByToken();
          if (user) {
            if (user.data.type == "business") {
              // console.log("problem business");
              localStorage.removeItem("access_tokenB");
              Cookies.remove("auth.access_tokenB");
              Cookies.remove("auth.refresh_tokenB");
              Cookies.remove("auth.user_idB");
              //Por si hay pruebas de cuentas worker o personal
              Cookies.remove("auth.access_token");
              Cookies.remove("auth.refresh_token");
              Cookies.remove("auth.user_id");
              setUser({});
              router.push("/login");
              return;
            }
            // console.log("todo bien", user.data);
            Cookies.set("auth.user_idB", user.data._id);
            setUser(user.data);
            setLoggedIn(true);
            setLoginModal(true);

            if (user.data.type == "worker") {
              setWorker(true);
              if (
                !router.pathname.includes("worker") &&
                router.pathname != "/workers-found/[id]" &&
                router.pathname != "/worker/[id]" &&
                !router.pathname.includes("/service-details/")
              ) {
                router.push("/worker/home");
                return;
              } else {
                return;
              }
            } else {
              setWorker(false);
              if (
                router.pathname.includes("worker") &&
                router.pathname != "/workers-found/[id]" &&
                router.pathname != "/worker/[id]"
              ) {
                router.push("/");
                return;
              } else {
                return;
              }
            }
          } else {
            // console.log("no hay nada1");
            setUser({});
            setLoggedIn(false);
            router.push("/login");
            return;
          }
        } else {
          if (session) {
            // console.log("hay sesion google");
            const user = await UserService.loginGoogle(
              session.user.name,
              session.user.email,
              session.user.image
            );
            if (user) {
              if (user.data.type == "business") {
                // console.log("problem business");
                localStorage.removeItem("access_tokenB");
                Cookies.remove("auth.access_tokenB");
                Cookies.remove("auth.refresh_tokenB");
                Cookies.remove("auth.user_idB");
                //Por si hay pruebas de cuentas worker o personal
                Cookies.remove("auth.access_token");
                Cookies.remove("auth.refresh_token");
                Cookies.remove("auth.user_id");
                setUser({});
                router.push("/login");
                return;
              }
              Cookies.set("auth.access_token", user.data.access_token);
              Cookies.set("auth.refresh_token", user.data.refresh_token);
              Cookies.set("auth.user_id", user.data.user._id);
              setLoggedIn(true);
              setLoginModal(true);
              setUser(user.data.user);
              // console.log("justo antes", user.data.user);

              if (user.data.user.type == "worker") {
                // console.log("es worker");
                setWorker(true);
                router.push("/worker/home");
                return;
              } else {
                setWorker(false);
                if (service && Object.keys(service).length > 0) {
                  // console.log("caso1");
                  router.push(`/summary`);
                } else {
                  // console.log("caso2");
                  router.push("/");
                }
              }
            }
          } else {
            setLoggedIn(false);
            return;
          }
        }
      }
    }
  };

  return null; //Este componente no renderiza nada
};
