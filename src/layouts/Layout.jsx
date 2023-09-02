import { useRouter } from "next/router";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
import clsx from "clsx";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});
function Layout({ children }) {
  const router = useRouter();

  return (
    <>
      <div className={clsx("relative", poppins.className)}>
        {router.pathname === "/login" ||
        router.pathname === "/register" ||
        router.pathname === "/alternative-login" ? (
          <WaveBar />
        ) : (
          router.pathname !== "/intro" && <TopBar />
        )}
        {children}
      </div>
    </>
  );
}

export default Layout;
