import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { useStore } from "@/store";
import { WorldIcon, MailIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

export default function Settings() {
  const { setWorker, isWorker } = useStore();

  const onFunction = () => {
    console.log("On");
  };

  const offFunction = () => {
    console.log("Off");
  };

  const workerModeOn = () => {
    setWorker(true);
  };

  const workerModeOff = () => {
    setWorker(false);
  };
  return (
    <div className="flex flex-col py-28 px-5 md:pl-80">
      <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} />
      <OptionCard title="Support" subtitle="Contact us" icon={MailIcon} />
      <div className="flex flex-col my-4">
        <OptionSwitch
          title="Activate Worker Mode"
          onFunction={workerModeOn}
          offFunction={workerModeOff}
          initialState={isWorker}
        />
        <OptionSwitch
          title="Activate Notifications"
          onFunction={onFunction}
          offFunction={offFunction}
        />
      </div>
      <div className="mt-40 flex flex-col">
        <OutlinedButton text="Save Changes" />
        <OutlinedButton text="Delete Account" secondary />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const redirect = {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
  const userId = req.cookies["auth.user_id"];
  if (!userId) return redirect;

  let user = null;
  try {
    const response = await UserService.get(userId);
    user = response.data;
    if (!user) return redirect;
  } catch (error) {
    console.error(error);
    return redirect;
  }

  return {
    props: {
      user: user,
    },
  };
}
