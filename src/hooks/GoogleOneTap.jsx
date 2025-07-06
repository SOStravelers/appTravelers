// hooks/GoogleOneTap.js
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import UserService from "@/services/UserService";

const GoogleOneTap = () => {
  useEffect(() => {
    getSession().then((session) => {
      if (session) return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_CLIENTID_GOOGLE,
          callback: async (response) => {
            try {
              const res = await fetch("/api/auth/onetap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
              });

              if (!res.ok) throw new Error("Error al validar el token");

              const session = await getSession();
              if (session) {
                await UserService.loginGoogle(
                  session.user.name,
                  session.user.email,
                  session.user.image
                );
              }
            } catch (error) {
              console.error("❌ Error One Tap:", error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        window.google?.accounts.id.prompt();
      };

      document.body.appendChild(script);
    });
  }, []);

  return null;
};

export default GoogleOneTap;
