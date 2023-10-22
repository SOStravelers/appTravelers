import WorkerProfileCardEdit from "@/components/utils/cards/WorkerProfileCardEdit";
import SectionAboutEdit from "@/components/profile/SectionAbout/SectionAboutEdit";
import UserService from "@/services/UserService";
import { useStore } from "@/store";

export default function WorkerEdit() {
  const { user } = useStore();
  console.log("el user", user);
  return (
    <div className="py-28 px-5 md:pl-80">
      <WorkerProfileCardEdit
        name={user?.personalData?.name?.first}
        service={user?.workerData?.services}
        score={5}
        avatar={user?.img?.imgUrl}
      />
      <SectionAboutEdit
        description={user?.about}
        gallery={user?.img?.gallery}
      />
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
