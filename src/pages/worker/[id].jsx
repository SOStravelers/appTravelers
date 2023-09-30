import { useState } from "react";
import WorkerProfileCard from "@/components/utils/cards/WorkerProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ONE } from "@/constants";

export default function Worker() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  return (
    <div className="px-10 pb-20">
      <WorkerProfileCard name={"Worker Name"} service={"Service"} score={5} />
      <SwitchButtons actualView={actualView} setActualView={setActualView} titleOne={'About'} titleTwo={'Services'} />
      {actualView === SECTION_ONE ? (
        <SectionAbout
          description={"Description"}
          experience={"Experience"}
          languages={"Languages"}
        />
      ) : (
        <SectionServices
          services={"Services"}
          price={"Price"}
          schedule={"Schedule"}
        />
      )}
    </div>
  );
}
