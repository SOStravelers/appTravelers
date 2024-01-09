import clsx from "clsx";
import { SECTION_ONE, SECTION_TWO } from "@/constants";

function SwitchButtons({ actualView, setActualView, titleOne, titleTwo }) {
  return (
    <div className="bg-transparentBlue w-full max-w-lg h-12 flex rounded-xl">
      <button
        className={clsx(
          "w-1/2 h-full font-semibold rounded-xl",
          actualView === SECTION_ONE
            ? "bg-blueBorder text-white"
            : " text-blueBorder"
        )}
        onClick={() => setActualView(SECTION_ONE)}
      >
        {titleOne}
      </button>
      <button
        className={clsx(
          "w-1/2 h-full font-semibold rounded-xl",
          actualView === SECTION_TWO
            ? "bg-blueBorder text-white"
            : " text-blueBorder"
        )}
        onClick={() => setActualView(SECTION_TWO)}
      >
        {titleTwo}
      </button>
    </div>
  );
}

export default SwitchButtons;
