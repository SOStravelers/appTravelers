import { useEffect, useState } from "react";
import HostelProfileCard from "@/components/utils/cards/HostelProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ONE } from "@/constants";
import HostelService from "@/services/HostelService";
import Head from "next/head";

export default function Hostel({ hostel }) {
  const [actualView, setActualView] = useState(SECTION_ONE);
  useEffect(() => {
    console.log(hostel);
    document.title = hostel?.businessData?.name + " - SOS Travelers";
  }, []);
  return (
    <div className="mb-20 py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <Head>
        <title>Sos Travelers</title>
        <meta name="description" content="Facilita tu viaje" />
        <meta property="og:title" content="SOS Travelers" />
        <meta property="og:description" content={hostel?.businessData?.name} />
        <meta
          property="og:image"
          content={hostel?.img?.imgUrl || "/assets/logoSos.png"}
        />
      </Head>

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
  const hostelId = params.id;
  if (!hostelId) return redirect;

  let hostel = null;
  try {
    const response = await HostelService.getBusiness(hostelId);
    hostel = response.data;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      hostel: hostel,
    },
  };
}
