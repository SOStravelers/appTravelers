import { useState } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import { SECTION_DAY } from "@/constants";

export default function Booking() {
  const [actualView, setActualView] = useState(SECTION_DAY);

  return (
    <div className="w-screen h-screen p-5 bg-white text-black">
      <SwitchButtons
        actualView={actualView}
        setActualView={setActualView}
        titleOne={"Day"}
        titleTwo={"Month"}
      />
    </div>
  );
}
