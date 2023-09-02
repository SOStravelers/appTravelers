import { useState } from "react";
import HostelProfileCard from "@/components/utils/cards/HostelProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ABOUT } from "@/constants";

export default function Hostel() {
  const [actualView, setActualView] = useState(SECTION_ABOUT);
  return (
    <div className="px-10 mb-20">
      <HostelProfileCard name={"Hostel Name"} location={"Location"} score={5} />
      <SwitchButtons actualView={actualView} setActualView={setActualView} />
      {actualView === SECTION_ABOUT ? (
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
