import {
  MdWifiOff,
  MdBeachAccess,
  MdFlight,
  MdHotel,
  MdDirectionsBus,
} from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { LogoSosWhite } from "@/constants/icons";

export default function OfflineScreen() {
  return (
    <div className="fixed inset-0 bg-darkBlueCard z-[9999] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex flex-col items-center mt-4 mb-3 animate-fadeIn">
        <LogoSosWhite style={{ width: 80, height: 80 }} />
        <span className="text-3xl  mt-2 text-softWhite tracking-tight">
          SOS Travelers
        </span>
      </div>

      {/* Icono central y mensaje */}
      <div className="bg-darkBlueSoft rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center  animate-fadeIn">
        <MdWifiOff className="text-softWhite mb-4" size={50} />
        <h2 className="text-lg font-bold text-center text-softWhite mb-2">
          ¡Sin conexión a internet!
        </h2>
        <p className="text-softWhite mb-6 text-md text-center leading-relaxed">
          No pudimos conectarnos a la red...
          <br />
          Por favor revisa tu conexión.
          <br />
          <span className="font-medium text-softWhite text-sm">
            La app se reintentará automáticamente apenas recuperes el acceso.
          </span>
        </p>

        {/* Íconos turísticos animados */}
        <div className="flex justify-center gap-5 text-softWhite mb-2 animate-bounce-slow">
          <MdBeachAccess size={34} />
          <MdFlight size={34} />
          <MdHotel size={34} />
          <MdDirectionsBus size={34} />
        </div>

        {/* Loader */}
        <ThreeDots color="#fefefe" height={50} width={50} />

        {/* Mensaje abajo */}
        <span className="block text-xs text-softWhite mt-2">
          SOS Travelers — Turismo sin límites
        </span>
      </div>
    </div>
  );
}
