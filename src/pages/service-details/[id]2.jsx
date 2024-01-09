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
    <div>
      <div className=" flex flex-col pt-20  lg:pt-24 xl:pt-24  md:pl-80">
        <div className="font-semibold text-center px-8 max-w-lg">
          <SwitchButtons
            actualView={actualView}
            setActualView={setActualView}
            titleOne={"General"}
            titleTwo={"Details"}
          />
        </div>
      </div>
      {actualView === SECTION_ONE ? <GeneralTab /> : <DetailsTab />}
    </div>
  );
}
