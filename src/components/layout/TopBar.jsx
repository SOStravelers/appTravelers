import {
  NotificationOffIcon,
  LogoWhite,
  NotificationIcon,
} from "@/constants/icons";
import clsx from "clsx";

import { FiBell, FiBellOff } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { random } from "@/lib/utils";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import Link from "next/link";
import TextModal from "@/components/utils/modal/TextModal";
import { Howl } from "howler";
import Router from "next/router";
import languageData from "@/language/menu.json";
import { validationImg } from "@/utils/validation";
import LanguageSelector from "@/components/utils/selector/LanguageSelector";
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

  const [scrolledPastVh, setScrolledPastVh] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolledPastVh) {
        setScrolledPastVh(isScrolled);
      }
    };

    // Set initial state on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolledPastVh]); // Re-run effect if scrolledPastVh changes

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
      className={clsx(
        "w-screen z-30 fixed top-0 transition-all duration-500",
        "lg:px-10 xl:px-10 px-3 flex items-center justify-between h-18 lg:h-16 xl:h-16",
        router.pathname === "/"
          ? scrolledPastVh
            ? "bg-darkBlue"
            : "bg-transparent"
          : "bg-darkBlue"
      )}
      style={{
        backgroundColor:
          scrolledPastVh || router.pathname !== "/" ? undefined : "transparent",
        WebkitBackdropFilter: scrolledPastVh ? "none" : "blur(0px)", // opcional
        backdropFilter: scrolledPastVh ? "none" : "blur(0px)", // opcional
      }}
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
            // remove the old fontSize (it doesn’t affect SVG paths)
            size={38} // ← pick the pixel size you want (e.g. 18 × 18 px)
            color="white"
            style={{ "&:focus": { outline: "none" } }} // keep any extra styles you need
          />
        </Link>
        <div>
          <p className="text-white font-semibold text-md">SOS</p>
          <p
            style={{ marginTop: "-10px" }}
            className="text-white font-semibold text-md"
          >
            Travelers
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {loggedIn ? (
          <>
            <div className="d-flex flex-col">
              {isWorker && (
                <h1 className="text-white mr-3 neon-green text-xs sm:text-base md:text-lg lg:text-lg xl:text-lg">
                  Worker Mode
                </h1>
              )}
            </div>

            <Link href="/notifications" className="relative lg:mx-4 xl:mx-5">
              {/* campana (siempre) */}
              <FiBell className="w-5 h-5 mr-4 text-white" />

              {/* puntito SOLO cuando existe notificación */}
              {haveNotification && (
                <span className="absolute -top-0.5  inline-flex h-2 w-2">
                  {/* efecto ping (opcional) */}
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  {/* círculo sólido */}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
              )}
            </Link>

            {isImageAccessible && user?.img && user?.img.imgUrl ? (
              <Link
                className="rounded-xl"
                href={profileUrl}
                style={{ width: "36px", height: "36px", overflow: "hidden" }}
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
            {/* <Link className="text-white text-sm mr-2" href="/login">
              {languageData.signIn[language]}
            </Link>
            <Link
              className="text-white border border-white text-sm px-3 py-1 rounded-xl"
              href="/register"
            >
              {languageData.join[language]}
            </Link> */}

            <span className="mx-1 text-white">RJ</span>

            <button className="flex items-center justify-center mr-6 text-white hover:text-white/80 transition">
              <FiMapPin size={16} />
            </button>
            <LanguageSelector />
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
