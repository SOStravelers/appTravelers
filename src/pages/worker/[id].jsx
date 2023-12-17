import { useEffect, useState } from "react";
import Router from "next/router";
import WorkerProfileCard from "@/components/utils/cards/WorkerProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ONE } from "@/constants";
import UserService from "@/services/UserService";

export default function Worker() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [user, setUser] = useState(null);
  const router = Router;
  const id = router.query.id;

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    document.title =
      user?.personalData?.name?.first +
      " " +
      user?.personalData?.name?.last +
      " - SOS Travelers";
  }, [user]);

  const getUserData = async () => {
    const response = await UserService.getUserById(id);
    if (response?.data) {
      setUser(response.data);
    }
  };
  const capitalize = (cadena) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
  };
  const setName = (name) => {
    if (!name) return "";
    return capitalize(name?.first) + " " + capitalize(name?.last);
  };

  let galleryFilter = user?.img?.gallery.filter((image) => image !== null);
  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <WorkerProfileCard
        name={setName(user?.personalData?.name)}
        services={user?.workerData?.services}
        score={5}
        avatar={user?.img?.imgUrl}
      />
      <SwitchButtons
        actualView={actualView}
        setActualView={setActualView}
        titleOne={"About"}
        titleTwo={"Services"}
      />
      {actualView === SECTION_ONE ? (
        <SectionAbout description={user?.about} gallery={galleryFilter} />
      ) : (
        <SectionServices
          type="worker"
          services={user?.workerData?.services || []}
          price={"Price"}
          schedule={"Schedule"}
        />
      )}
    </div>
  );
}
