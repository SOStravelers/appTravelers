import { LogoSosRelleno } from "@/constants/icons";
import { ThreeDots } from "react-loader-spinner";

export default function LoaderGlobal() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-backgroundP z-50 flex flex-col items-center justify-center transition-opacity duration-300 opacity-100">
      <LogoSosRelleno />
      <p className="font-medium mt-4 text-textColor text-xl">SOS Travelers</p>
      <div className="w-12 h-12 mt-3 border-4 border-t-transparent border-textColor rounded-full animate-spin"></div>
    </div>
  );
}
