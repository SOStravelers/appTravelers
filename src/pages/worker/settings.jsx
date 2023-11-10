import { useState } from "react";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { WorldIcon, MailIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

export default function WorkerSettings() {
  const { setWorker, isWorker } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openInactive, setOpenInactive] = useState(false);
  const [isOnWorker, setIsOnWorker] = useState(false);
  const [isOnInactive, setIsInactive] = useState(false);
  const [isOnNotifications, setIsOnNotifications] = useState(false);

  const onFunction = () => {
    console.log("On");
  };

  const offFunction = () => {
    console.log("Off");
  };

  const workerModeOff = () => {
    console.log("dialogo user");
    setIsOnWorker(true);
    setOpen(true);
  };
  const confirmChangeWorkerMode = async () => {
    console.log("confirmachageWorkerMode");
    localStorage.removeItem("type");
    setWorker(false);
    setOpen(false);
    setIsOnWorker(false);
    router.push("/");
  };
  const cancelChangeWorkerMode = async () => {
    setOpen(false);
  };

  const inactiveModeOn = () => {
    console.log("dialogo inactive1");
    setOpenInactive(true);
    setIsInactive(false);
  };
  const inactiveModeOff = () => {
    console.log("dialogo inactive2");
    setIsInactive();
  };
  const confirmInactiveMode = async () => {
    console.log("confirmInactiveMode");
    setOpenInactive(false);
    setIsInactive(true);
  };
  const cancelInactiveMode = async () => {
    console.log("cancelInactiveMode");
    setOpenInactive(false);
  };

  return (
    <div className="flex flex-col py-28 px-5 md:pl-80">
      <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} />
      <OptionCard title="Support" subtitle="Contact us" icon={MailIcon} />
      <div className="flex flex-col my-4">
        <OptionSwitch
          title="Activate Worker Mode"
          onFunction={workerModeOff}
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
          onFunction={inactiveModeOn}
          offFunction={inactiveModeOff}
          isOn={isOnInactive}
          setIsOn={setIsInactive}
        />
      </div>
      <div className="mt-10 flex flex-col">
        {/* <OutlinedButton text="Save Changes" /> */}
        <OutlinedButton text="Deactivate Account" error />
      </div>
      <TextModal
        title={`Activate User Mode`}
        text={["Are you sure you want to activate user mode?"]}
        buttonText="Let's go"
        open={open}
        setOpen={setOpen}
        onAccept={confirmChangeWorkerMode}
        onCancel={cancelChangeWorkerMode}
      />
      <TextModal
        title={`Hide my worker account`}
        text={[
          "Are you sure you want to inactive your account?",
          "",
          "You will not receive job offers or notifications of new opportunities.",
          "",
          "You can change this option at any time.",
        ]}
        buttonText="Accept"
        open={openInactive}
        setOpen={setOpenInactive}
        onAccept={confirmInactiveMode}
        onCancel={cancelInactiveMode}
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
