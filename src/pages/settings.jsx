import { useState, useEffect } from "react";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import Select from "react-select";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { WorldIcon, MailIcon } from "@/constants/icons";
import UserService from "@/services/UserService";
import WorkerService from "@/services/WorkerService";
import Link from "next/link";
import languageData from "@/language/settings.json";
import Cookies from "js-cookie";
import SettingsComponent from "../components/settings/Settings";
import { MdEmail } from "react-icons/md";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function Settings() {
  const { setWorker, isWorker, setService, language, setLanguage } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isOnWorker, setIsOnWorker] = useState(false);
  const [isCheckWorker, setisCheckWorker] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openNotification, setOpenNotification] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOnNotification, setIsOnNotification] = useState(true);
  const [selection, setSelection] = useState({});
  const optionsSupport = [
    { value: "en", label: languageData.language[language]["en"] },
    { value: "es", label: languageData.language[language]["es"] },
    { value: "fr", label: languageData.language[language]["fr"] },
    { value: "de", label: languageData.language[language]["de"] },
    { value: "pt", label: languageData.language[language]["pt"] },
  ];
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);
  useEffect(() => {
    setService({});
    document.title = "Settings | SOS Travelers";
  }, []);
  useEffect(() => {
    setIsOnNotification(true);
  }, []);

  useEffect(() => {
    setSelection({
      value: language,
      label: languageData.language[language][language],
    });
  }, []);

  const setValue = (valor) => {
    setLanguage(valor.value);
    Cookies.set("language", valor.value);
    setSelection({
      value: valor.value,
      label: languageData.language[valor.value][valor.value],
    });
  };

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
    <div
      className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      <Link href="support" className="w-full flex mt-3">
        <OptionCard
          title={languageData.support.title[language]}
          subtitle={languageData.support.body[language]}
          icon={MdEmail}
        />
      </Link>
      <SettingsComponent />

      <div className="flex flex-col my-4">
        {(process.env.NEXT_PUBLIC_NODE_ENV === "Development" ||
          process.env.NODE_ENV === "dev") && (
          <OptionSwitch
            title="Worker Mode"
            onFunction={workerModeOn}
            offFunction={workerModeOff}
            initialState={isWorker}
            isOn={isOnWorker}
            setIsOn={setIsOnWorker}
          />
        )}
        {/* <OptionSwitch
          title="Notifications"
          onFunction={notificationModeOn}
          offFunction={notificationModeOff}
          isOn={isOnNotification}
          setIsOn={setIsOnNotification}
        /> */}
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
