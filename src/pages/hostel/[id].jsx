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
    document.title = hostel?.businessData?.name + " - SOS Travelers";
  }, []);

  const getData = async () => {
    const id = router.query.id;
    try {
      const response = await HostelService.getBusiness(id);
      setHostel(response.data);
      console.log(response.data);
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
          services={hostel?.businessData?.services || []}
          price={"Price"}
          schedule={"Schedule"}
        />
      )}
    </div>
  );
}

// export async function getServerSideProps({ params }) {
//   console.log("todo mal");
//   const hostelId = params.id;
//   if (!hostelId) return redirect;

//   let hostel = null;
//   try {
//     const response = await HostelService.getBusiness(hostelId);
//     hostel = response.data;
//   } catch (error) {
//     console.error(error);
//   }

//   return {
//     props: {
//       hostel: hostel,
//     },
//   };
// }
