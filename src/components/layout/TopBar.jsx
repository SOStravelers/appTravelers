import {
  NotificationOffIcon,
  LogoWhite,
  NotificationIcon,
} from "@/constants/icons";
import { useEffect, useRef, useState } from "react";
import { random } from "@/lib/utils";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import Link from "next/link";
import TextModal from "@/components/utils/modal/TextModal";
import { Howl } from "howler";
import Router from "next/router";
import languageData from "@/language/menu.json";
import { validationImg } from "@/utils/validation";
const sound = new Howl({
  src: ["/notysound.mp3"], // Ajusta la ruta según la estructura de tu proyecto
});
import { useStore } from "@/store";
function TopBar() {
  const router = Router;
  const { loggedIn, user, isWorker, setUser, haveNotification, language } =
    useStore();
  const [booking, setBooking] = useState({});
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  const [isImageAccessible, setIsImageAccessible] = useState(false);
  const socket = useRef();
  var userId = Cookies.get("auth.user_id");
  useEffect(() => {
    if (user != undefined && user.img && user.img.imgUrl) {
      let newUser = { ...user };
      newUser.img.imgUrl = user.img.imgUrl + "?hola=" + random();
      setUser[newUser];
    }
  }, [user]);
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
  const stateBookingWorker = async () => {
    console.log("stateBookingWorker");
    router.push(`/service-details/${booking._id}`);
  };
  const cancelWorkerModal = async () => {
    console.log("cancelWorkerModal");
    setOpenWorkerModal(false);
  };
  const profileUrl = isWorker ? "/worker/profile" : "/profile";
  const initials = () => {
    if (user && Object.keys(user).length === 0) return "";
    const name = user?.personalData?.name;
    if (!name) return "";
    const { first, last } = name;
    const str = `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
    return str;
  };

  useEffect(() => {
    const checkImage = async () => {
      const validImg = await validationImg(user?.img?.imgUrl);
      setIsImageAccessible(validImg);
    };
    checkImage();
  }, [user?.img?.imgUrl]);

  return (
    <div
      // className={`w-screen z-20 lg:px-10 xl:px-10 flex items-center justify-between h-18 lg:h-16 xl:h-16 px-3 fixed top-0 ${
      //   process.env.NEXT_PUBLIC_NODE_ENV != "production"
      //     ? "bg-blueBorder"
      //     : "bg-darkBlue"
      // }`}
      className={`w-screen z-20 lg:px-10 xl:px-10 flex items-center justify-between h-18 lg:h-16 xl:h-16 px-3 fixed top-0 bg-darkBlue `}
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
      <div className="flex items-center">
        <Link
          href="/"
          style={{ textDecoration: "none", color: "inherit" }}
          className="mr-2 my-2"
        >
          <LogoWhite
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              "&:focus": { outline: "none" },
              fontSize: "0.5rem", // Ajusta el tamaño del texto según tus necesidades
            }}
            color={"white"}
          />
        </Link>
        <div>
          <p className="text-white font-semibold text-lg">SOS</p>
          <p
            style={{ marginTop: "-12px" }}
            className="text-white font-semibold text-lg"
          >
            Travelers
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {loggedIn ? (
          <>
            <div className="d-flex flex-col">
              {process.env.NEXT_PUBLIC_NODE_ENV != "production" && (
                <h1 className="text-white mr-3 neon-dark text-xs  text-center  sm:text-base md:text-lg lg:text-lg xl:text-lg">
                  {process.env.NEXT_PUBLIC_NODE_ENV == "dev" ||
                  process.env.NEXT_PUBLIC_NODE_ENV == "development"
                    ? "Dev Version"
                    : " Test Version"}
                </h1>
              )}
              {isWorker && (
                <h1 className="text-white mr-3 neon-green text-xs sm:text-base md:text-lg lg:text-lg xl:text-lg">
                  Worker Mode
                </h1>
              )}
            </div>
            {haveNotification ? (
              <Link href="/notifications" className="lg:mx-4 xl:mx-5">
                <NotificationIcon
                  active={"true"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:focus": { outline: "none" },
                    fontSize: "0.1rem", // Ajusta el tamaño del texto según tus necesidades
                  }}
                  color="#FFFFFF"
                  className="mr-3 cursor-pointer"
                />
              </Link>
            ) : (
              <Link href="/notifications" className="lg:mx-5 xl:mx-5">
                <NotificationOffIcon
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:focus": { outline: "none" },
                    fontSize: "0.1rem", // Ajusta el tamaño del texto según tus necesidades
                  }}
                  color="#FFFFFF"
                  className="mr-3 cursor-pointer"
                />
              </Link>
            )}

            {isImageAccessible && user?.img && user?.img.imgUrl ? (
              <Link
                className="rounded-xl"
                href={profileUrl}
                style={{ width: "40px", height: "40px", overflow: "hidden" }}
              >
                <img
                  src={user.img.imgUrl}
                  alt="Descripción de la imagen"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Link>
            ) : (
              <Link
                href="/profile"
                className="border border-white  text-sm text-white px-3 py-2 text rounded-xl"
              >
                {initials()}
              </Link>
            )}
          </>
        ) : (
          <>
            {process.env.NEXT_PUBLIC_NODE_ENV != "production" && (
              <h1 className="text-white mr-2 neon-dark text-xs  text-center  sm:text-base md:text-lg lg:text-lg xl:text-lg">
                {process.env.NEXT_PUBLIC_NODE_ENV == "dev" ||
                process.env.NEXT_PUBLIC_NODE_ENV == "development"
                  ? "Dev V"
                  : " Test V"}
              </h1>
            )}
            <Link className="text-white text-sm mr-2" href="/login">
              {languageData.signIn[language]}
            </Link>
            <Link
              className="text-white border border-white text-sm px-3 py-1 rounded-xl"
              href="/register"
            >
              {languageData.join[language]}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
