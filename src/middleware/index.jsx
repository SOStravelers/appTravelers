// lib/middleware.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
export function useCustomMiddleware() {
  const router = useRouter();

  const { isWorker, user } = useStore();

  useEffect(() => {
    var shouldRedirect = true;
    if (router.pathname.includes("worker") && !isWorker) {
      shouldRedirect = false;
    }

    if (!shouldRedirect) {
      router.push("/");
    }
  }, [router]);
}
