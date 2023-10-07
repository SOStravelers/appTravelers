import WorkerProfileCard from "@/components/utils/cards/WorkerProfileCard";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";

export default function WorkerEdit() {
  return (
    <div className="px-10 pb-20">
      <WorkerProfileCard name={"Worker Name"} service={"Service"} score={5} />
      <SectionAbout
        description={"Description"}
        experience={"Experience"}
        languages={"Languages"}
      />
    </div>
  );
}
