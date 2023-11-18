// lib/middleware.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useCustomMiddleware() {
  const router = useRouter();

  useEffect(() => {
    var shouldRedirect = true;
    if (router.pathname.includes("worker") && !isWorker) {
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
      shouldRedirect = false;
    }
    if (!shouldRedirect) {
      router.push("/");
    }
  }, [router.pathname]);
}
