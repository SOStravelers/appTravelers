// hooks/GoogleOneTap.js
import { useEffect } from "react";
import { getSession, signIn } from "next-auth/react";
import jwtDecode from "jwt-decode";
import UserService from "@/services/UserService";

const GoogleOneTap = () => {
  useEffect(() => {
    const initGoogleOneTap = async () => {
      const session = await getSession();
      if (session) return;

      if (typeof window === "undefined") return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;

      console.log("One Tap origin:", window.location.origin);
      console.log(
        "One Tap client_id:",
        process.env.NEXT_PUBLIC_CLIENTID_GOOGLE
      );

      script.onload = () => {
        if (!window.google || !window.google.accounts) {
          console.error("Google One Tap not available");
          return;
        }

        console.log("Google One Tap initialized");

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_CLIENTID_GOOGLE,
          callback: async (response) => {
            try {
              const decoded = jwtDecode(response.credential);
              const { name, email, picture } = decoded;

              // Primero, iniciar sesión con NextAuth (sin redirigir)
              const signInRes = await signIn("google", {
                id_token: response.credential,
                redirect: false,
              });

              if (signInRes?.ok) {
                // Luego, autenticar con tu backend
                await UserService.loginGoogle(name, email, picture);
                window.location.href = "/"; // Redirigir manualmente
              }
            } catch (err) {
              console.error("One Tap login failed", err);
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
