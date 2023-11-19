import { useState, useEffect } from "react";
import OptionCard from "@/components/utils/cards/OptionCard";
import { useStore } from "@/store";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { WorldIcon, MailIcon, CurrencyIcon } from "@/constants/icons";
import UserService from "@/services/UserService";

export default function WorkerSettings() {
  const { setWorker, isWorker } = useStore();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openInactive, setOpenInactive] = useState(false);

  const [isOnWorker, setIsOnWorker] = useState(false);
  const [isOnInactive, setIsInactive] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOnNotification, setIsOnNotification] = useState(true);

  useEffect(() => {
    setIsOnNotification(true);
  }, []);
  //Worker Functions
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
  // Inactive Functions
  const inactiveModeOn = async () => {
    console.log("dialogo inactive1");
    setOpenInactive(true);
    setIsInactive(false);
  };
  const inactiveModeOff = async () => {
    console.log("dialogo inactive2");

    try {
      const response = await UserService.inactiveMode(true);
      if (response.data) {
        setIsInactive(false);
        toast.info("Saved.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      }
    } catch (err) {
      toast.error("Internal Server Error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    }
  };
  const confirmInactiveMode = async () => {
    console.log("confirmInactiveMode");
    try {
      const response = await UserService.inactiveMode(false);
      if (response.data) {
        setOpenInactive(false);
        setIsInactive(true);
        toast.info("Saved.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      }
    } catch (err) {
      toast.error("Internal Server Error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    }
  };
  const cancelInactiveMode = async () => {
    console.log("cancelInactiveMode");
    setOpenInactive(false);
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
      <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} />
      <OptionCard title="Currency" subtitle="American Dollar" icon={CurrencyIcon} />
      <OptionCard title="Support" subtitle="Contact us" icon={MailIcon} />
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
//   try {
//     const response = await UserService.get(userId);
//     user = response.data;
//     if (!user) return redirect;
//   } catch (error) {
//     console.error(error);
//     return redirect;
//   }

//   return {
//     props: {
//       user: user,
//     },
//   };
// }
