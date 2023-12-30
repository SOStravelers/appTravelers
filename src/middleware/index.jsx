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

  // const routeValidation = async () => {
  //   console.log("validar", isWorker, !!user);
  //   if (user == undefined) {
  //     // setUser({});
  //     // router.push("/");
  //     return;
  //   }
  //   if (
  //     router.pathname.includes("worker") &&
  //     !isWorker &&
  //     router.pathname != "/workers-found/[id]" &&
  //     router.pathname != "/worker/[id]"
  //   ) {
  //     console.log("caso1");
  //     router.push("/");
  //   } else if (
  //     (!user || Object.keys(user).length == 0) &&
  //     (router.pathname == "/profile" ||
  //       router.pathname == "/personal-details" ||
  //       router.pathname == "/payment-confirmation" ||
  //       router.pathname == "/settings" ||
  //       router.pathname == "/payment" ||
  //       router.pathname == "/stripe")
  //   ) {
  //     console.log("caso2");
  //     router.push("/");
  //   } else if (
  //     user &&
  //     Object.keys(user).length > 0 &&
  //     isWorker &&
  //     (router.pathname == "/" ||
  //       router.pathname == "/profile" ||
  //       router.pathname == "/chat" ||
  //       router.pathname == "/favorites" ||
  //       router.pathname == "/settings" ||
  //       router.pathname == "/payment" ||
  //       router.pathname == "/stripe")
  //   ) {
  //     console.log("caso3");
  //     router.push("/worker/home");
  //   } else if (
  //     user &&
  //     Object.keys(user).length > 0 &&
  //     (router.pathname == "/login" || router.pathname == "/register")
  //   ) {
  //     console.log("caso4");
  //     router.push("/");
  //   }
  // };

  const obtenerInformacionUsuario = async () => {
    let cookieAccessToken = Cookies.get("auth.access_token");
    if (user && Object.keys(user).length > 0) {
      console.log("ya hay usuario");
      return;
    }
    let route = router.pathname;
    console.log("route", route, route == "/forgot-password");
    if (route == "/login" && !cookieAccessToken) {
      console.log("caso login");
      if (!user || (Object.keys(user).length == 0 && !cookieAccessToken)) {
        console.log("no hay usuario");
        return;
      } else {
        router.push("/");
      }
    } else if (
      route == "/forgot-password" ||
      route == "/change-password" ||
      route == "/recovery-password"
    ) {
      console.log("caso libre");
      return;
    } else {
      console.log("caso else");
      if (!user || Object.keys(user).length == 0) {
        console.log("no hay usuario");

        if (cookieAccessToken) {
          console.log("set user back");
          const user = await UserService.getUserByToken();
          if (user) {
            if (user.data.type == "business") {
              console.log("problem business");
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
            console.log("todo bien", user.data);
            Cookies.set("auth.user_idB", user.data._id);
            setUser(user.data);
            setLoggedIn(true);
            setLoginModal(true);

            if (user.data.type == "worker") {
              setWorker(true);
              if (
                router.pathname != "/workers-found/[id]" &&
                router.pathname != "/worker/[id]"
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
            console.log("no hay nada1");
            setUser({});
            setLoggedIn(false);
            router.push("/login");
            return;
          }
        } else {
          console.log("no hay nada2");
          setUser({});
          setLoggedIn(false);
          router.push("/login");
          return;
        }
      }
    }
  };

  return null; //Este componente no renderiza nada
};
