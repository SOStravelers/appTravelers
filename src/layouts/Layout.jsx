import { useRouter } from "next/router";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import TopBarSubMenu from "@/components/layout/TopBarSubMenu";
import clsx from "clsx";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

function Layout({ children }) {
  const router = useRouter();

  const isLoginPage =
    router.pathname === "/login" ||
    router.pathname === "/register" ||
    router.pathname === "/alternative-login";

  const arePrincipalPages =
    router.pathname === "/booking" ||
    router.pathname === "/chat" ||
    router.pathname === "/favorites" ||
    router.pathname === "/profile" ||
    router.pathname === "/" ||
    router.pathname === "/worker/home" ||
    router.pathname === "/worker/booking";

  const isIntro = router.pathname === "/intro";

  const isPaymentConfirm = router.pathname === "/payment-confirmation";

  return (
    <>
      <div className={clsx("relative", poppins.className)}>
        {isLoginPage ? (
          <WaveBar />
        ) : arePrincipalPages ? (
          <TopBar />
        ) : (
          !isIntro && !isPaymentConfirm && <TopBarSubMenu />
        )}

        {children}
      </div>
    </>
  );
}

export default Layout;
