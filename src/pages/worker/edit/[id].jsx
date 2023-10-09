import WorkerProfileCard from "@/components/utils/cards/WorkerProfileCard";
import SectionAbout from "@/components/profile/SectionAbout/SectionAbout";
import UserService from "@/services/UserService";

export default function WorkerEdit({ user }) {
  return (
    <div className="px-10 pb-20">
      <WorkerProfileCard
        name={user?.personalData?.name?.first}
        service={user?.workerData?.services}
        score={5}
        avatar={user?.img?.imgUrl}
      />
      <SectionAbout description={user?.about} gallery={user?.img?.gallery} />
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
