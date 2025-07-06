import { useEffect } from "react";
import { getSession, signIn } from "next-auth/react";
import UserService from "@/services/UserService";

const GoogleOneTap = () => {
  useEffect(() => {
    const initGoogleOneTap = async () => {
      const session = await getSession();
      if (session) return; // Ya está logueado, no hacemos nada

      if (typeof window === "undefined") return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (!window.google || !window.google.accounts) {
          console.error("Google One Tap no disponible");
          return;
        }

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_CLIENTID_GOOGLE,
          callback: async (response) => {
            try {
              // Login con NextAuth sin redirigir
              const result = await signIn("google", {
                id_token: response.credential,
                redirect: false,
              });

              // Esperar sesión actualizada
              const session = await getSession();
              if (session?.user) {
                const { name, email, image } = session.user;
                await UserService.loginGoogle(name, email, image);
                window.location.href = "/";
              }
            } catch (error) {
              console.error("Error al iniciar sesión con One Tap", error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        window.google.accounts.id.prompt();
      };

      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      initGoogleOneTap();
    } else {
      window.addEventListener("load", initGoogleOneTap);
      return () => window.removeEventListener("load", initGoogleOneTap);
    }
  }, []);

  return null;
};

export default GoogleOneTap;
