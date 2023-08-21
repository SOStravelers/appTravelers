import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";

function Layout({ children }) {
  return (
    <>
      <TopBar />
      {children}
      <Navbar />
    </>
  );
}

export default Layout;
