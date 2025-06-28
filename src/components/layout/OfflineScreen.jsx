import {
  MdWifiOff,
  MdBeachAccess,
  MdFlight,
  MdHotel,
  MdDirectionsBus,
} from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { LogoSosBlack } from "@/constants/icons";

export default function OfflineScreen() {
  return (
    <div className="fixed inset-0 bg-gray-50 z-[9999] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-3 animate-fadeIn">
        <LogoSosBlack style={{ width: 80, height: 80 }} />
        <span className="text-3xl font-black mt-2 text-blue-800 tracking-tight">
          SOS Travelers
        </span>
      </div>

      {/* Icono central y mensaje */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center border border-blue-100 animate-fadeIn">
        <MdWifiOff className="text-black mb-4" size={54} />
        <h2 className="text-2xl font-bold text-blue-800 mb-2">
          ¡Sin conexión a internet!
        </h2>
        <p className="text-gray-700 mb-6 text-center leading-relaxed">
          No pudimos conectarnos a la red.
          <br />
          Por favor revisa tu conexión.
          <br />
          <span className="font-medium text-blue-600">
            La app se reintentará automáticamente apenas recuperes el acceso.
          </span>
        </p>

        {/* Íconos turísticos animados */}
        <div className="flex justify-center gap-5 text-blue-400 mb-6 animate-bounce-slow">
          <MdBeachAccess size={34} />
          <MdFlight size={34} />
          <MdHotel size={34} />
          <MdDirectionsBus size={34} />
        </div>

        {/* Loader */}
        <ThreeDots color="#2563eb" height={45} width={80} />

        {/* Mensaje abajo */}
        <span className="block text-xs text-gray-400 mt-5">
          SOS Travelers — Turismo sin límites
        </span>
      </div>
    </div>
  );
}
