import { LogoSosRelleno } from "@/constants/icons";
import { ThreeDots } from "react-loader-spinner";

export default function LoaderGlobal() {
  return (
    <div className="w-sreen flex flex-col h-screen  items-center justify-center">
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
