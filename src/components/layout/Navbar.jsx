import { useRouter } from "next/router";
import Cookies from "js-cookie";
import clsx from "clsx";
import NotificationService from "@/services/NotificationService";
import languageData from "@/language/menu.json";
import Link from "next/link";
import { useEffect, useState } from "react";
import { validationImg } from "@/utils/validation";
import { PiHouseFill, PiHouse } from "react-icons/pi"; // Phosphor Icons
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import {
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaUserAlt,
  FaHeart,
  FaRegHeart,
  FaRegUser,
} from "react-icons/fa";
import { HiMiniHome } from "react-icons/hi2"; // sólido
import { HiOutlineHome } from "react-icons/hi"; // contorno

import {
  HomeIcon,
  HomeIconOutlined,
  BookingIcon,
  BookingIconOutlined,
  RequestIcon,
  RequestIconOutlined,
  ChatIcon,
  ChatIconOutlined,
  FavoriteIcon,
  FavoriteIconOutlined,
  ProfileIcon,
  ProfileIconOutlined,
} from "@/constants/icons";
import { useStore } from "@/store";
function Navbar() {
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(false);
  const userCookie = Cookies.get("auth.user_id");
  const [isImageAccessible, setIsImageAccessible] = useState(false);
  const {
    isWorker,
    user,
    setHaveNotification,
    language,
    setService,
    loggedIn,
  } = useStore();
  const userId = Cookies.get("auth.user_id");
  const goTo = (ruta) => {
    if (!userCookie && ruta != "/" && ruta != "/profile") {
      setOpenLogin(true);
      return;
    }
    setService({});
    if (ruta != "/" && ruta != "/worker/home") {
      checkNotification();
    }
    router.push(ruta);
  };
  useEffect(() => {
    const checkImage = async () => {
      console.log("checkeando", user);
      const validImg = await validationImg(user?.img?.imgUrl);
      console.log("validando", validImg);
      setIsImageAccessible(validImg);
    };
    checkImage();
  }, [user]);

  const goProfile = () => {
    if (!user || Object.keys(user).length === 0) {
      router.push("/guest-settings");
    } else {
      goTo(isWorker ? "/worker/profile" : "/profile");
    }
  };
  const checkNotification = async () => {
    try {
      if (!userId) return;
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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
      className="w-screen h-12 fixed border bottom-0 left-0 z-30 bg-white flex justify-around items-center md:hidden"
      // style={{ boxShadow: "2px 2px 34px 0px rgba(0, 0, 0, 0.2)" }}
    >
      <button
        className="customButton flex mt-1 flex-col items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/home" : "/")}
      >
        {router.pathname === "/" || router.pathname === "/worker/home" ? (
          <span className="text-blueBorder">
            <PiHouseFill size={24} />
          </span>
        ) : (
          <span className="text-gray-500">
            <PiHouse size={24} />
          </span>
        )}
        <span
          role="presentation"
          style={{ marginTop: "-2px" }}
          className={clsx(
            "text-sm",
            router.pathname === "/" || router.pathname === "/worker/home"
              ? "text-blueBorder"
              : "text-greyText"
          )}
        >
          {languageData.home[language]}
        </span>
      </button>

      <button
        className="flex mt-1 flex-col items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/booking" : "/booking")}
      >
        {router.pathname.includes("booking") ? (
          <FaCalendarAlt size={22} color="#3498db" />
        ) : (
          <FaRegCalendarAlt size={22} className="text-gray-500" />
        )}
        <span
          role="presentation"
          className={clsx(
            "text-sm",
            router.pathname === "/booking" ||
              router.pathname === "/worker/booking"
              ? "text-blueBorder"
              : "text-greyText"
          )}
        >
          {languageData.bookings[language]}
        </span>
      </button>

      {/* 
      <button
        className="flex mt-1 flex-col items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/chat" : "/chat")}
      >
        {router.pathname.includes("chat") ? (
          <ChatIcon color="#3498db" />
        ) : (
          <ChatIconOutlined color="black" />
        )}
        <span
          role="presentation"
          className={clsx(
            "text-sm",
            router.pathname.includes("chat")
              ? "text-blueBorder"
              : "text-greyText"
          )}
        >
          {languageData.chat[language]}
        </span>
      </button> */}

      {!isWorker && (
        <button
          className="flex mt-1 flex-col items-center justify-center"
          onClick={() => goTo(isWorker ? "/worker/favorites" : "/favorites")}
        >
          {router.pathname.includes("favorites") ? (
            <span className="text-blueBorder">
              <FaHeart size={22} />
            </span>
          ) : (
            <span className="text-gray-500">
              <FaRegHeart size={22} />
            </span>
          )}

          <span
            role="presentation"
            className={clsx(
              "text-sm",
              router.pathname.includes("favorites")
                ? "text-blueBorder"
                : "text-greyText"
            )}
          >
            {languageData.favorites[language]}
          </span>
        </button>
      )}
      {isWorker && (
        <button
          className="flex mt-1 flex-col items-center justify-center"
          onClick={() => goTo("/worker/requests")}
        >
          {router.pathname.includes("/worker/requests") ? (
            <RequestIcon color="#3498db" />
          ) : (
            <RequestIconOutlined color="black" />
          )}
          <span
            role="presentation"
            className={clsx(
              "text-sm",
              router.pathname === "/worker/requests"
                ? "text-blueBorder"
                : "text-greyText"
            )}
          >
            Trabalhos
          </span>
        </button>
      )}

      <button
        className="flex mt-1 flex-col items-center justify-center"
        onClick={() => goProfile()}
      >
        {/* {router.pathname.includes("profile") ? (
          <ProfileIcon color="#3498db" />
        ) : (
          <ProfileIconOutlined color="black" />
        )} */}
        {loggedIn ? (
          isImageAccessible && user?.img && user?.img.imgUrl ? (
            <>
              <Link
                className="rounded-xl"
                href={"/profile"}
                style={{ width: "32px", height: "32px", overflow: "hidden" }}
              >
                <img
                  src={user.img.imgUrl}
                  alt="Descripción de la imagen"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Link>
              <span
                role="presentation"
                className={clsx(
                  "text-xs",
                  router.pathname.includes("profile")
                    ? "text-blueBorder"
                    : "text-greyText"
                )}
              >
                {languageData.profile[language]}
              </span>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="border border  text-sm  px-3 py-2 text rounded-xl"
              >
                {initials()}
              </Link>
              <span
                role="presentation"
                className={clsx(
                  "text-xs",
                  router.pathname.includes("profile")
                    ? "text-blueBorder"
                    : "text-greyText"
                )}
              >
                {languageData.profile[language]}
              </span>
            </>
          )
        ) : (
          <button
            className="flex mt-1 flex-col items-center justify-center"
            onClick={() => goTo(isWorker ? "/worker/profile" : "/profile")}
          >
            {router.pathname.includes("profile") ? (
              <span className="text-blueBorder">
                <FaUserAlt size={22} />
              </span>
            ) : (
              <span className="text-gray-500">
                <FaRegUser size={22} />
              </span>
            )}
            <span
              role="presentation"
              className={clsx(
                "text-sm",
                router.pathname === "/profile" ||
                  router.pathname === "/worker/profile"
                  ? "text-blueBorder"
                  : "text-greyText"
              )}
            >
              {languageData.profile[language]}
            </span>
          </button>
        )}
      </button>

      {!userCookie && (
        <LoginFormModal
          open={openLogin}
          setOpen={setOpenLogin}
          title="Login to continue"
        />
      )}
    </div>
  );
}

export default Navbar;
