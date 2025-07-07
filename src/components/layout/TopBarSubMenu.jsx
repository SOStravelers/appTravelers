import { useState, useEffect, useRef } from "react";
import { ReturnArrowIcon } from "@/constants/icons";
import { useRouter } from "next/router";
import { LogoWhite } from "@/constants/icons";
import clsx from "clsx";
import Link from "next/link";
import { useStore } from "@/store";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useDynamicRouteTitles } from "@/constants/index";
import TextModal from "@/components/utils/modal/TextModal";
import { Howl } from "howler";
import { validationImg } from "@/utils/validation";
import languageData from "@/language/menu.json";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
const sound = new Howl({
  src: ["/notysound.mp3"], // Ajusta la ruta según la estructura de tu proyecto
});
function TopBarSubMenu() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();
  const [booking, setBooking] = useState({});
  const [openLogin, setOpenLogin] = useState(false);
  const socket = useRef();
  const userCookie = Cookies.get("auth.user_id");
  const [isImageAccessible, setIsImageAccessible] = useState(false);
  const { isWorker, setScrollY, setRestoreScroll, language, loggedIn, user } =
    useStore(); // 👈 nuevos
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  var userId = Cookies.get("auth.user_id");
  const routeTitles = useDynamicRouteTitles();
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
    if (!routeTitles || Object.keys(routeTitles).length === 0) {
      console.error("routeTitles no está definido o está vacío.");
      return;
    }

    Object.keys(routeTitles).forEach((route) => {
      if (actualURL.includes(route)) {
        setTitulo(routeTitles[route]); // Establece el título basado en la URL actual
      }
    });
  };

  useEffect(() => {
    const checkImage = async () => {
      const validImg = await validationImg(user?.img?.imgUrl);
      setIsImageAccessible(validImg);
    };
    checkImage();
  }, [user?.img?.imgUrl]);
  const profileUrl = isWorker ? "/worker/profile" : "/profile";
  const initials = () => {
    if (user && Object.keys(user).length === 0) return "";
    const name = user?.personalData?.name;
    if (!name) return "";
    const { first, last } = name;
    const str = `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
    return str;
  };

  return (
    <div
      className={clsx(
        "w-screen flex items-center justify-between h-18 lg:h-20 xl:h-20 lg:px-20 xl:px-20  px-5 shadow-xl fixed top-0 z-40",
        "bg-darkBlue"
      )}
    >
      {!userCookie && (
        <LoginFormModal
          open={openLogin}
          setOpen={setOpenLogin}
          title="Login to continue"
        />
      )}
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
      {/* <div className="flex items-center">
        <Link
          className="text-white border rounded-lg px-2 py-1 text-sm mr-3"
          href="/login"
        >
          {languageData.signIn[language]}
        </Link>
        <Link
          className="my-2"
          href={isWorker ? "/worker/home" : "/"}
          scroll={false}
          onClick={() => {
            setScrollY(window.scrollY); // guardamos Y
            setRestoreScroll(true); // marcamos que hay que restaurar
          }}
        >
          <LogoWhite
            // remove the old fontSize (it doesn’t affect SVG paths)
            size={38} // ← pick the pixel size you want (e.g. 18 × 18 px)
            color="white"
            style={{ "&:focus": { outline: "none" } }} // keep any extra styles you need
          />
        </Link>
      </div> */}

      <div className="flex  h-14 justify-center items-center">
        {loggedIn ? (
          <>
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
            <p
              className="text-white text-sm border px-2 rounded-lg py-1"
              onClick={() => setOpenLogin(true)}
            >
              {languageData.signIn[language]}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBarSubMenu;
