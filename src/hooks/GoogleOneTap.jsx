import { useEffect } from "react";
import { getSession } from "next-auth/react";
import jwtDecode from "jwt-decode";
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
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_CLIENTID_GOOGLE,
          callback: async (response) => {
            try {
              const decoded = jwtDecode(response.credential);
              const { name, email, picture } = decoded;

              await UserService.loginGoogle(name, email, picture);
            } catch (err) {
              console.error("Error decoding token", err);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        window.google.accounts.id.prompt();
      };
      document.body.appendChild(script);
    });
  }, []);

  return null;
};

export default GoogleOneTap;
