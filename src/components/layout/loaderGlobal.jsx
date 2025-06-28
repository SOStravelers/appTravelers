import { LogoSosRelleno } from "@/constants/icons";
import { ThreeDots } from "react-loader-spinner";

export default function LoaderGlobal() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-300 opacity-100">
      <LogoSosRelleno />
      <p className="font-medium mt-4 text-xl">SOS Travelers</p>
      <ThreeDots
        wrapperStyle={{ marginTop: "-25px" }}
        width={100}
        height={100}
        color="black"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
}
