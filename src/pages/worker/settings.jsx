import { useState } from "react";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import { useStore } from "@/store";
import { WorldIcon, MailIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

export default function WorkerSettings() {
  const { setWorker, isWorker } = useStore();
  const [open, setOpen] = useState(false);
  const [isOnWorker, setIsOnWorker] = useState(false);
  const [isOnNotifications, setIsOnNotifications] = useState(false);

  const onFunction = () => {
    console.log("On");
  };

  const offFunction = () => {
    console.log("Off");
  };

  const workerModeOn = () => {
    setOpen(true);
  };

  const workerModeOff = () => {
    setOpen(false);
  };

  const confirmChangeWorkerMode = async () => {
    setWorker(true);
    setOpen(false);
    setIsOnWorker(true);
  };

  const cancelChangeWorkerMode = async () => {
    setWorker(false);
    setOpen(false);
    setIsOnWorker(false);
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
          isOn={isOnWorker}
          setIsOn={setIsOnWorker}
        />
        <OptionSwitch
          title="Activate Notifications"
          onFunction={onFunction}
          offFunction={offFunction}
          isOn={isOnNotifications}
          setIsOn={setIsOnNotifications}
        />
        <OptionSwitch
          title="Inactive Mode"
          onFunction={onFunction}
          offFunction={offFunction}
          isOn={isOnNotifications}
          setIsOn={setIsOnNotifications}
        />
      </div>
      <div className="mt-40 flex flex-col">
        <OutlinedButton text="Save Changes" />
        <OutlinedButton text="Delete Account" secondary />
      </div>
      <TextModal
        title="Worker Mode"
        text="Are you sure you want to activate worker mode?"
        buttonText="Accept"
        open={open}
        setOpen={setOpen}
        onAccept={confirmChangeWorkerMode}
        onCancel={cancelChangeWorkerMode}
      />
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
