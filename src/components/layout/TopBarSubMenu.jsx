import { useState, useEffect, useRef } from "react";
import { ReturnArrowIcon } from "@/constants/icons";
import { useRouter } from "next/router";
import { LogoWhite } from "@/constants/icons";
import clsx from "clsx";
import Link from "next/link";
import { useStore } from "@/store";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { routeTitles } from "@/constants/index";
import TextModal from "@/components/utils/modal/TextModal";
import { Howl } from "howler";
const sound = new Howl({
  src: ["/notysound.mp3"], // Ajusta la ruta según la estructura de tu proyecto
});
function TopBarSubMenu() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();
  const [booking, setBooking] = useState({});
  const socket = useRef();
  const { isWorker } = useStore();
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  var userId = Cookies.get("auth.user_id");
  useEffect(() => {
    if (isWorker) {
      console.log("conect socket worker");
      const host = process.env.NEXT_PUBLIC_API_SOCKET_IO;
      socket.current = io(host);
      socket.current.emit("add-user", userId);

      socket.current.on("booking-recieve", (data) => {
        console.log("booking recibido", data);
        setBooking(data.data);
        sound.play();
        setOpenWorkerModal(true);
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [isWorker]);
  const actualURL = router.pathname;
  useEffect(() => {
    handleUrl();
  }, [actualURL, routeTitles]);
  const stateBookingWorker = async () => {
    console.log("stateBookingWorker");
    router.push(`/service-details/${booking._id}`);
  };
  const cancelWorkerModal = async () => {
    console.log("cancelWorkerModal");
    setOpenWorkerModal(false);
  };
  const handleUrl = () => {
    Object.keys(routeTitles).forEach((route) => {
      if (actualURL.includes(route)) {
        setTitulo(routeTitles[route]);
      }
    });
  };

  return (
    <div
      className={clsx(
        "w-screen flex items-center justify-between h-18 lg:h-20 xl:h-20 lg:px-20 xl:px-20  px-5 shadow-xl fixed top-0 z-20",
        "bg-darkBlue"
      )}
    >
      <TextModal
        title={"Parabéns!!, você tem uma nova reserva"}
        text={[
          `Lugar: ${booking?.businessUser?.businessData?.name}`,
          `Data: ${booking?.date?.stringData} | ${booking?.startTime?.stringData}`,
        ]}
        textCancel="Voltar"
        buttonText={"Veja a reserva"}
        open={openWorkerModal}
        setOpen={setOpenWorkerModal}
        onAccept={stateBookingWorker}
        onCancel={cancelWorkerModal}
      />
      <div onClick={() => router.back()}>
        <ReturnArrowIcon color="#fff" size="35" />
      </div>
      <h1 className={clsx(" text-xl", "text-white")}>{titulo}</h1>
      <Link className="my-2" href={isWorker ? "/worker/home" : "/"}>
        <LogoWhite
          style={{
            textDecoration: "none",
            color: "inherit",
            "&:focus": { outline: "none" },
            fontSize: "0.5rem", // Ajusta el tamaño del texto según tus necesidades
          }}
          color={"white"}
        />
      </Link>
    </div>
  );
}

export default TopBarSubMenu;
