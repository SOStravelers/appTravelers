import WorkerProfileCardEdit from "@/components/utils/cards/WorkerProfileCardEdit";
import SectionAboutEdit from "@/components/profile/SectionAbout/SectionAboutEdit";
import UserService from "@/services/UserService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "@/store";

export default function WorkerEdit() {
  const router = useRouter();
  const { user, setUser } = useStore();
  useEffect(() => {}, []);
  console.log("userabout", user.about);

  return (
    <div className="py-28 px-5 md:pl-80">
      <WorkerProfileCardEdit
        name={user?.personalData?.name?.first}
        lastName={user?.personalData?.name?.last}
        service={user?.workerData?.services}
        score={5}
        avatar={user?.img?.imgUrl}
      />
      <SectionAboutEdit about={user?.about} gallery={user?.img?.gallery} />
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
  if (!userId) return redirect;

  let user = null;
  try {
    const response = await UserService.get(userId);
    user = response.data;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      user: user,
    },
  };
}
