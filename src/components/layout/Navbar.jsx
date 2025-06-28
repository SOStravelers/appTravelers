import { useRouter } from "next/router";
import Cookies from "js-cookie";
import clsx from "clsx";
import NotificationService from "@/services/NotificationService";
import languageData from "@/language/menu.json";
import { useEffect, useState } from "react";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
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
  const { isWorker, user, setHaveNotification, language, setService } =
    useStore();
  const userId = Cookies.get("auth.user_id");
  const goTo = (ruta) => {
    if (!userCookie && ruta != "/" && ruta != "/profiles") {
      setOpenLogin(true);
      return;
    }
    setService({});
    if (ruta != "/" && ruta != "/worker/home") {
      checkNotification();
    }
    router.push(ruta);
  };
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

  return (
    <navbar
      className="w-screen h-12 fixed border bottom-0 left-0 z-30 bg-white flex justify-around items-center md:hidden"
      // style={{ boxShadow: "2px 2px 34px 0px rgba(0, 0, 0, 0.2)" }}
    >
      <button
        className=" customButton flex mt-1 flex-col items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/home" : "/")}
      >
        {router.pathname === "/" || router.pathname === "/worker/home" ? (
          <HomeIcon color="#3498db" />
        ) : (
          <HomeIconOutlined color="black" />
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
          <BookingIcon color="#3498db" />
        ) : (
          <BookingIconOutlined color="black" />
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
            <FavoriteIcon color="#3498db" />
          ) : (
            <FavoriteIconOutlined color="black" />
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
        {router.pathname.includes("profile") ? (
          <ProfileIcon color="#3498db" />
        ) : (
          <ProfileIconOutlined color="black" />
        )}

        <span
          role="presentation"
          className={clsx(
            "text-sm",
            router.pathname.includes("profile")
              ? "text-blueBorder"
              : "text-greyText"
          )}
        >
          {languageData.profile[language]}
        </span>
      </button>

      {!userCookie && (
        <LoginFormModal
          open={openLogin}
          setOpen={setOpenLogin}
          title="Login to continue"
        />
      )}
    </navbar>
  );
}

export default Navbar;
