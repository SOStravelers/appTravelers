import { useRouter } from "next/router";
import TopBar from "@/components/layout/TopBar";
import WaveBar from "@/components/layout/WaveBar";
function Layout({ children }) {
  const router = useRouter();

  return (
    <>
      <div className="relative">
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
