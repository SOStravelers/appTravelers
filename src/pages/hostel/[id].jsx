import { useState } from "react";
import HostelProfileCard from "@/components/utils/cards/HostelProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ONE } from "@/constants";
import UserService from "@/services/UserService";

export default function Hostel({ hostel }) {
  const [actualView, setActualView] = useState(SECTION_ONE);

  return (
    <div className="mb-20 py-28 px-5 md:pl-80">
      <HostelProfileCard
        name={hostel?.businessData?.name}
        location={`${hostel?.businessData?.location?.city} , ${hostel?.businessData?.location?.country}`}
        score={5}
        avatar={hostel?.img?.imgUrl}
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
          gallery={[hostel?.img?.imgUrl, hostel?.img?.imgUrl]}
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

export async function getServerSideProps({ params }) {
  const redirect = {
    redirect: {
      destination: "/guest-settings",
      permanent: false,
    },
  };
  const userId = params.id;
  console.log(userId);
  if (!userId) return redirect;

  let hostel = null;
  try {
    const response = await UserService.get(userId);
    hostel = response.data;
    console.log(hostel);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      hostel: hostel,
    },
  };
}
