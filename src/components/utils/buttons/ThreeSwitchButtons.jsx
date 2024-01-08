import clsx from "clsx";
import { SECTION_ONE, SECTION_TWO, SECTION_THREE } from "@/constants";

function ThreeSwitchButtons({
  actualView,
  setActualView,
  titleOne,
  titleTwo,
  titleThree,
}) {
  return (
    <div className="bg-transparentBlue w-full max-w-lg h-14 flex rounded-xl">
      <button
        className={clsx(
          "w-1/3 h-full font-semibold rounded-xl",
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
          "w-1/3 h-full font-semibold rounded-xl",
          actualView === SECTION_TWO
            ? "bg-blueBorder text-white"
            : " text-blueBorder"
        )}
        onClick={() => setActualView(SECTION_TWO)}
      >
        {titleTwo}
      </button>
      <button
        className={clsx(
          "w-1/3 h-full font-semibold rounded-xl",
          actualView === SECTION_THREE
            ? "bg-blueBorder text-white"
            : " text-blueBorder"
        )}
        onClick={() => setActualView(SECTION_THREE)}
      >
        {titleThree}
      </button>
    </div>
  );
}

export default ThreeSwitchButtons;
