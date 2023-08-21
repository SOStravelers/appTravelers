import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";

function LayoutWave() {
  return (
    <>
      <TopBar />
      {children}
      <Navbar />
    </>
  );
}

export default LayoutWave;
