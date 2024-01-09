import { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import WorkerProfileCard from "@/components/utils/cards/WorkerProfileCard";
import SwitchButtons from "@/components/utils/buttons/SwitchButtons";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import SectionServices from "@/components/profile/SectionServices/SectionServices";
import { SECTION_ONE } from "@/constants";
import UserService from "@/services/UserService";
import { Rings } from "react-loader-spinner";
export default function Worker() {
  const [actualView, setActualView] = useState(SECTION_ONE);
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = Router;
  const id = router.query.id;

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    let nombre =
      user?.personalData?.name?.first + " " + user?.personalData?.name?.last;
    document.title = nombre + " | SOS Travelers";
    setNombre(nombre);
    setImage(user?.img?.imgUrl);
  }, [user]);

  const getUserData = async () => {
    try {
      const response = await UserService.getUserById(id);
      if (response?.data) {
        setUser(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const setName = (name) => {
    const first = name?.first
      ? name?.first.charAt(0).toUpperCase() + name?.first?.slice(1)
      : "";
    const last = name?.last
      ? name?.last?.charAt(0).toUpperCase() + name?.last?.slice(1)
      : "";
    return first + " " + last;
  };

  let galleryFilter = user?.img?.gallery.filter((image) => image !== null);
  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : (
        <>
          <Head>
            <title>Sos Travelers</title>
            <meta name="description" content={`Visit my profile: ` + nombre} />

            {/* Redes sociales */}
            <meta property="og:title" content="SOS Travelers" />
            <meta
              property="og:description"
              content={`Visit my profile: ` + nombre}
            />

            <meta
              property="og:image"
              content={image + `?random=${Math.random()}`}
            />
          </Head>
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
        </>
      )}
    </div>
  );
}
