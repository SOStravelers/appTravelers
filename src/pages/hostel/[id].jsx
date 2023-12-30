import { useEffect, useState } from "react";
import HostelProfileCard from "@/components/utils/cards/HostelProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ONE } from "@/constants";
import { useRouter } from "next/router";
import HostelService from "@/services/HostelService";
export default function Hostel() {
  const [hostel, setHostel] = useState(null);
  const router = useRouter();
  const [actualView, setActualView] = useState(SECTION_ONE);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    document.title =
      hostel?.businessData?.name + " | SOS Travelers" ||
      "hotel" + " | SOS Travelers";
  }, [hostel]);

  const getData = async () => {
    const id = router.query.id;
    try {
      const response = await HostelService.getBusiness(id);
      setHostel(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mb-20 py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <HostelProfileCard
        name={hostel?.businessData?.name}
        location={`${hostel?.businessData?.location?.city} , ${hostel?.businessData?.location?.country}`}
        score={5}
        avatar={hostel?.img?.imgUrl || "/assets/user.png"}
      />
      <SwitchButtons
        titleOne={"About"}
        titleTwo={"Services"}
        actualView={actualView}
        setActualView={setActualView}
      />
      {actualView === SECTION_ONE ? (
        <SectionAbout
          description={hostel?.about}
          gallery={hostel?.img?.gallery}
        />
      ) : (
        <SectionServices
          type="business"
          services={hostel?.businessData?.services || []}
          price={"Price"}
          schedule={"Schedule"}
        />
      )}
    </div>
  );
}
