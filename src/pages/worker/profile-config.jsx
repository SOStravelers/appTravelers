import { useRouter } from "next/router";
import OptionCard from "@/components/utils/cards/OptionCard";
import {
  UserIcon,
  ListIcon,
  LockIcon,
  ServicesIcon,
  CheckBoxesPicture,
  CertificationPicture,
} from "@/constants/icons";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import { toast } from "react-toastify";
import TextModal from "@/components/utils/modal/TextModal";

export default function WorkerProfile() {
  const [IsOnWorker, setIsOnWorker] = useState(false);
  const [mServCheck, setMServCheck] = useState(false);
  const [mProfCheck, setMProfCheck] = useState(false);
  const [mScheCheck, setMScheCheck] = useState(false);
  const [mPlacCheck, setMPlacCheck] = useState(false);
  const [openInactive, setOpenInactive] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();

  const activeModeOff = async () => {
    setOpenInactive(true);
  };

  const fetchData = async () => {
    try {
      const newuser = await UserService.getUserByToken();
      setUser(newuser.data);
      const activeVal = newuser.data?.workerData?.isActive;
      setIsOnWorker(activeVal);

      // Ahora que tenemos el usuario, podemos obtener activeVal
    } catch (err) {
      setUser({});
      setIsOnWorker(false); // Si hay un error, podrías querer establecer esto en un valor por defecto
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setMServCheck(user?.workerData?.isMyServicesOk);
    setMProfCheck(user?.workerData?.isAboutmeOk);
    setMScheCheck(user?.workerData?.isMySchedulesOk);
    setMPlacCheck(user?.workerData?.isMyWorkplacesOk);
  }, [user]);

  const activeModeOn = async () => {
    try {
      const isActiveCheck =
        mServCheck && mProfCheck && mScheCheck && mPlacCheck;
      if (isActiveCheck) {
        setIsOnWorker(true);
        await UserService.readyToWork({ isActive: true });
        toast.info("You are now ready to receive job offers.", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        });
      } else {
        setIsOnWorker(false);
        toast.error("You need to complete your Worker profile", {
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
    try {
      await UserService.readyToWork({ isActive: false });
      setIsOnWorker(false);
      toast.info("Saved.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Internal Server Error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    }
  };
  const cancelInactiveMode = () => {
    try {
      setIsOnWorker(true); // Actualizar el estado después de cerrar el modal
      toast.info("No changes were saved.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    } catch (err) {
      toast.error("Internal Server Error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    } finally {
      setOpenInactive(false); // Cerrar el modal después de mostrar el mensaje
    }
  };

  return (
    <div className="bg-white h-full w-screen py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <div className="flex flex-col max-w-lg px-2 justify-center my-4">
        <OptionSwitch
          title="Ready to work"
          onFunction={activeModeOn}
          offFunction={activeModeOff}
          isOn={IsOnWorker}
          setIsOn={setIsOnWorker}
        />
        <TextModal
          title={`Hide my worker account`}
          text={[
            "Are you sure you want to inactive your account?",
            "You will not receive job offers or notifications of new opportunities.",
            "You can change this option at any time.",
          ]}
          buttonText="Accept"
          open={openInactive}
          setOpen={setOpenInactive}
          onAccept={confirmInactiveMode}
          onCancel={cancelInactiveMode}
        />
      </div>
      <OptionCard
        title="My Services"
        subtitle="Abilities and skills"
        icon={ServicesIcon}
        check={mServCheck}
        onClick={() => router.push("/worker/my-services")}
      />
      <OptionCard
        title="About Me"
        subtitle="Gallery and description"
        icon={UserIcon}
        check={mProfCheck}
        onClick={() => router.push(`/worker/edit/${user._id}`)}
      />
      <OptionCard
        title="My Schedules"
        subtitle="Set your calendar"
        icon={ListIcon}
        check={mScheCheck}
        onClick={() => router.push("/worker/my-schedules") && console.log()}
      />
      {/* <OptionCard
        title="My Workplaces"
        subtitle="Establishments"
        disabled={true}
        icon={LockIcon}
        check={mPlacCheck}
        onClick={() => router.push("/worker/my-workplaces")}
      /> */}
      <div className="max-w-lg text-center text-xl my-5 flex flex-col justify-center">
        {IsOnWorker ? (
          <>
            <CertificationPicture className="lg:pl-20 xl:ml-20 " />

            <p className="text-center mt-4 text-sm italic">
              You have been Validated!!, now you are ready to start working,
              remember to have your profile updated to receive better jobs
            </p>
          </>
        ) : (
          <>
            <CheckBoxesPicture className="" />
            <p className="text-center text-sm italic">
              To be a validated worker, complete all the fields above
            </p>
          </>
        )}
      </div>
    </div>
  );
}
