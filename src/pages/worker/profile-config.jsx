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
  const { isWorker } = useStore();

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
        toast.info(
          isWorker
            ? "Agora você está pronto para receber ofertas de emprego."
            : "You are now ready to receive job offers.",
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1500,
          }
        );
      } else {
        setIsOnWorker(false);
        toast.error(
          isWorker
            ? "Você precisa completar seu perfil de trabalho"
            : "You need to complete your Worker profile",
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 1500,
          }
        );
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
      toast.info(
        isWorker ? "Nenhuma alteração foi salva." : "No changes were saved.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
        }
      );
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
          title={isWorker ? "Pronto para trabalhar" : "Ready to work"}
          onFunction={activeModeOn}
          offFunction={activeModeOff}
          isOn={IsOnWorker}
          setIsOn={setIsOnWorker}
        />
        <TextModal
          title={
            isWorker
              ? "Ocultar minha conta de trabalho"
              : "Hide my worker account"
          }
          text={[
            isWorker
              ? "Tem certeza de que deseja desativar sua conta"
              : "Are you sure you want to inactive your account?",
            isWorker
              ? "Você não receberá ofertas de emprego ou notificações de novas oportunidades."
              : "You will not receive job offers or notifications of new opportunities.",
            isWorker
              ? "Você pode alterar esta opção a qualquer momento."
              : "You can change this option at any time.",
          ]}
          buttonText={isWorker ? "Aceitar" : "Accept"}
          open={openInactive}
          setOpen={setOpenInactive}
          onAccept={confirmInactiveMode}
          onCancel={cancelInactiveMode}
        />
      </div>
      <OptionCard
        title={isWorker ? "Meus serviços" : "My Services"}
        subtitle={
          isWorker ? "Competências e habilidades" : "Abilities and skills"
        }
        icon={ServicesIcon}
        check={mServCheck}
        onClick={() => router.push("/worker/my-services")}
      />
      <OptionCard
        title={isWorker ? "Sobre mim" : "About Me"}
        subtitle={isWorker ? "Galeria e descrição" : "Gallery and description"}
        icon={UserIcon}
        check={mProfCheck}
        onClick={() => router.push(`/worker/edit/${user._id}`)}
      />
      <OptionCard
        title={isWorker ? "Meus horários" : "My Schedules"}
        subtitle={isWorker ? "Defina seu calendário" : "Set your calendar"}
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
              ¡Você foi validado! Agora, está pronto para começar a trabalhar.
              Lembre-se de manter seu perfil atualizado para receber
              oportunidades de emprego ainda melhores. 🚀
            </p>
          </>
        ) : (
          <>
            <CheckBoxesPicture className="" />
            <p className="text-center text-sm italic">
              Para ser um trabalhador validado, preencha todos os campos acima.
              Isso inclui adicionar 3 fotos à sua galeria, criar seu horário,
              adicionar seus serviços e, por fim, pressionar &quot; Pronto para
              trabalhar &quot;. 🌟
            </p>
          </>
        )}
      </div>
    </div>
  );
}
