import React from "react";
import { useStore } from "@/store"; // ajustado correctamente
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { FcGoogle } from "react-icons/fc";

function GoogleButton({ dark = "darkHeavy" }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const login = async () => {
    try {
      const result = await signIn("google", {
        redirect: false, // manejamos el redirect manualmente
      });

      if (result?.ok) {
        // Si viene de login o register → ir a "/"
        if (["/login", "/register", "/guest-settings"].includes(currentPath)) {
          router.push("/");
        } else {
          router.push(currentPath); // volver a donde estaba
        }
      } else {
        // Falló login → enviar a /login
        router.push("/login");
      }
    } catch (err) {
      console.error("Error durante login con Google", err);
      router.push("/login");
    }
  };

  return (
    <OutlinedButton
      text="Continue with Google"
      icon={FcGoogle}
      onClick={login}
      textColor="text-white"
      dark={dark}
      buttonCenter={true}
      textSize="text-xs"
    />
  );
}

export default GoogleButton;
