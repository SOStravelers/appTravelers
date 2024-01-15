import { useState, useEffect } from "react";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { WorldIcon, MailIcon } from "@/constants/icons";
import UserService from "@/services/UserService";
import WorkerService from "@/services/WorkerService";
import Link from "next/link";
export default function Settings() {
  const { setWorker, isWorker } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isOnWorker, setIsOnWorker] = useState(false);
  const [isCheckWorker, setisCheckWorker] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOnNotification, setIsOnNotification] = useState(true);
  useEffect(() => {
    document.title = "Settings | SOS Travelers";
  }, []);
  useEffect(() => {
    setIsOnNotification(true);
  }, []);

  const workerModeOn = () => {
    console.log("dialogo worker");
    setIsOnWorker(false);
    setOpen(true);
  };

  const isWorkerCheck = () => {
    console.log("Cheked Worker", isWorkerCheck);

    isWorkerCheck(false) ? setOpen(true) : setOpen(false);
  };

  const workerModeOff = () => {
    setIsOnWorker(true);
    setOpen(true);
  };

  const confirmChangeWorkerMode = async () => {
    console.log("confirmachageWorkerMode");
    try {
      let workerData = await WorkerService.setWorker();
      console.log("el worker", workerData);
      localStorage.setItem("type", "worker");
      setWorker(true);
      setOpen(false);
      setIsOnWorker(true);
      router.push("/worker/home");
    } catch (err) {
      console.log(err);
    }
  };

  const cancelChangeWorkerMode = async () => {
    setOpen(false);
  };

  // Notification Functions
  const notificationModeOn = () => {
    setIsOnNotification(true);
  };
  const notificationModeOff = () => {
    console.log("dialogo notification");
    setOpenNotification(true);
    setIsOnNotification(true);
  };
  const confirmNotification = async (option) => {
    console.log("confirmNotification");
    setOpenNotification(false);
    setIsOnNotification(false);
    console.log("Selected Option in MainPage:", option);
    setSelectedOption(option);
  };
  const cancelNotification = async () => {
    console.log("cancelInactiveMode");
    setOpenNotification(false);
  };

  return (
    <div className="flex flex-col py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      {/* <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} /> */}

      <Link href="/support" className="block">
        <OptionCard
          title="Support"
          subtitle="Contact us"
          icon={MailIcon}
        ></OptionCard>
      </Link>

      <div className="flex flex-col my-4">
        <OptionSwitch
          title="Worker Mode"
          onFunction={workerModeOn}
          offFunction={workerModeOff}
          initialState={isWorker}
          isOn={isOnWorker}
          setIsOn={setIsOnWorker}
        />
        {/* <OptionSwitch
          title="Notifications"
          onFunction={notificationModeOn}
          offFunction={notificationModeOff}
          isOn={isOnNotification}
          setIsOn={setIsOnNotification}
        /> */}
      </div>
      <div className="mt-10 flex flex-col">
        {/* <OutlinedButton text="Save Changes" /> */}
        <OutlinedButton text="Delete Account" error />
      </div>
      <TextModal
        title={`Activate Worker Mode`}
        text={["Are you sure you want to activate worker mode?"]}
        buttonText="Let's go"
        open={open}
        setOpen={setOpen}
        onAccept={confirmChangeWorkerMode}
        onCancel={cancelChangeWorkerMode}
      />
      <TextModal
        title={`Disable notifications`}
        text={["Which notifications would you like to deactivate?", ""]}
        buttonText="Accept"
        open={openNotification}
        selectOptions={[
          "Email notifications",
          "Push notifications",
          "WhatsApp notifications",
          "SOS team notifications",
          "All",
        ]}
        setOpen={setOpenNotification}
        onAccept={confirmNotification}
        onCancel={cancelNotification}
      />
    </div>
  );
}

// export async function getServerSideProps({ req }) {
//   const redirect = {
//     redirect: {
//       destination: "/login",
//       permanent: false,
//     },
//   };
//   const userId = req.cookies["auth.user_id"];
//   if (!userId) return redirect;

//   let user = null;
//   // try {
//   //   const response = await UserService.get(userId);
//   //   user = response.data;
//   //   if (!user) return redirect;
//   // } catch (error) {
//   //   console.error(error);
//   //   return redirect;
//   // }

//   return {
//     props: {
//       user: user,
//     },
//   };
// }
