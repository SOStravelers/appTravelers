import { useState, useEffect } from "react";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";

import { SECTION_ONE } from "@/constants";
import { useStore } from "@/store";
import { useRouter } from "next/router";

import GeneralTab from "@/components/service-details/generalTab";
import DetailsTab from "@/components/service-details/DetailsTab";

export default function ServiceDetails() {
  const store = useStore();
  const router = useRouter();

  const [actualView, setActualView] = useState(SECTION_ONE);

  return (
    <div className="w-full min-h-screen py-20 lg:py-24 xl:py-24 px-1 md:pl-80 bg-white text-black">
      <SwitchButtons
        style={{ position: "sticky", top: "10000px" }}
        actualView={actualView}
        setActualView={setActualView}
        titleOne={"General"}
        titleTwo={"Details"}
      />
      {actualView === SECTION_ONE ? <GeneralTab /> : <DetailsTab />}
    </div>
  );
}
