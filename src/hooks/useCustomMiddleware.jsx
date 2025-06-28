import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import UserService from "@/services/UserService";
import PartnerService from "@/services/PartnerService";
import { useStore } from "@/store";
import { getSession } from "next-auth/react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function useCustomMiddleware(onMiddlewareComplete) {
  const router = useRouter();
  const store = useStore();
  // const user = Cookies.get("auth.user");
  const {
    user,
    setUser,
    setLoggedIn,
    isWorker,
    service,
    setLanguage,
    setWorker,
    setLoginModal,
  } = store;

  useEffect(() => {
    const fetchData = async () => {
      if (!user || Object.keys(user).length === 0) {
        await obtenerInformacionUsuario();
      }
      setTimeout(() => {
        onMiddlewareComplete?.();
      }, 500);
    };

    fetchData();

    // Puedes devolver un cleanup si lo necesitas
    // return () => {};
  }, [onMiddlewareComplete]);

  const obtenerInformacionUsuario = async () => {
    let cookieAccessToken = Cookies.get("auth.access_token");
    let cookieLanguage = Cookies.get("language");

    const { partner } = router.query;
    if (partner) {
      Cookies.set("partner", partner);
      Cookies.set("timePartner", new Date().toISOString());
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();

    // Guardar visitorId
    if (result.visitorId != null) {
      PartnerService.sentIdClient(result.visitorId, partner);
    }

    if (typeof window !== "undefined") {
      //cambio lenguage∂
      if (cookieLanguage) {
        console.log("setLanguage");
        if (
          cookieLanguage != "pt" &&
          cookieLanguage != "es" &&
          cookieLanguage != "de" &&
          cookieLanguage != "en" &&
          cookieLanguage != "fr"
        ) {
          setLanguage("en");
          Cookies.set("language", "en");
        } else {
          setLanguage(cookieLanguage);
        }
      } else {
        const userLanguage = navigator.language || navigator.languages[0];
        const shortName = userLanguage.slice(0, 2);
        if (
          shortName != "pt" &&
          shortName != "es" &&
          shortName != "de" &&
          shortName != "en" &&
          shortName != "fr"
        ) {
          setLanguage("en");
          Cookies.set("language", "en");
        } else {
          setLanguage(shortName);
          Cookies.set("language", shortName);
        }
      }
    } else {
      setLanguage("en");
      Cookies.set("language", "en");
    }

    const session = await getSession();
    if (user && Object.keys(user).length > 0) {
      return;
    }
    let route = router.pathname;
    if (route == "/login") {
      if (
        (!user || Object.keys(user).length == 0) &&
        !cookieAccessToken &&
        !session
      ) {
        return;
      } else {
        router.push("/");
      }
    } else if (
      route == "/forgot-password" ||
      route == "/change-password" ||
      route == "/recovery-password"
    ) {
      return;
    } else {
      if (!user || Object.keys(user).length == 0) {
        if (cookieAccessToken) {
          const user = await UserService.getUserByToken();
          if (user) {
            console.log("el user", user);
            if (user.data.type == "business") {
              localStorage.removeItem("access_tokenB");
              Cookies.remove("auth.access_token");
              Cookies.remove("auth.access_tokenB");
              Cookies.remove("auth.refresh_token");
              Cookies.remove("auth.refresh_tokenB");
              Cookies.remove("auth.user_id");
              Cookies.remove("auth.user_idB");
              setUser({});
              router.push("/login");
              return;
            }
            Cookies.set("auth.user_id", user.data._id);
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
                console.log("entro aqui");
                router.push("/");
                return;
              } else {
                return;
              }
            }
          } else {
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
                  console.log(
                    "calabaza",
                    localStorage.getItem("fromCustomSummary"),
                    localStorage.getItem("fullUrl")
                  );
                  if (localStorage.getItem("fromCustomSummary") == "true") {
                    const url = localStorage.getItem("fullUrl");
                    localStorage.setItem("fromCustomSummary", "false");
                    window.location.href = url;

                    return;
                  } else {
                    router.push(`/summary`);
                  }
                } else {
                  // console.log("caso2");
                  router.push("/");
                }
              }
            }
          } else {
            setLoggedIn(false);
            if (
              router.pathname.includes("worker") &&
              router.pathname != "/workers-found/[id]" &&
              router.pathname != "/worker/[id]"
            ) {
              router.push("/");
              return;
            }
            // console.log("nada");
            return;
          }
        }
      }
    }
  };

  return null; //Este componente no renderiza nada
}
