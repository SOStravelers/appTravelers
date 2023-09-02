import clsx from "clsx";
import { SECTION_ABOUT, SECTION_SERVICES } from "@/constants";

function SwitchButtons({ actualView, setActualView }) {
  return (
    <div className="bg-azulClaro w-full h-14 flex rounded-xl">
      <button
        className={clsx(
          "w-1/2 h-full font-semibold rounded-xl",
          actualView === SECTION_ABOUT ? "bg-azul text-blanco" : " text-azul"
        )}
        onClick={() => setActualView(SECTION_ABOUT)}
      >
        About
      </button>
      <button
        className={clsx(
          "w-1/2 h-full font-semibold rounded-xl",
          actualView === SECTION_SERVICES ? "bg-azul text-blanco" : " text-azul"
        )}
        onClick={() => setActualView(SECTION_SERVICES)}
      >
        Services
      </button>
    </div>
  );
}

export default SwitchButtons;
