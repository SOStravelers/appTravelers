import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import clsx from "clsx";
import {
  HomeIcon,
  HomeIconOutlined,
  BookingIcon,
  BookingIconOutlined,
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
  const [id, setId] = useState([]);

  useEffect(() => {
    // Código que se ejecuta después de que el componente se monta
    setId[localStorage.getItem("auth.user_id")];
  }, []);

  const { isWorker } = useStore();
  const goTo = (ruta) => {
    router.push(ruta);
  };
  const goProfile = () => {
    if (!id) {
      router.push("/guest-settings");
    } else {
      goTo(isWorker ? "/worker/profile" : "/profile");
    }
  };

  return (
    <div
      className="w-screen h-12 fixed bottom-0 left-0 z-10 bg-white flex justify-around items-center md:hidden"
      style={{ boxShadow: "2px 2px 34px 0px rgba(0, 0, 0, 0.2)" }}
    >
      <button
        style={{}}
        className=" customButton flex flex-col mt-1 items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/home" : "/")}
      >
        {router.pathname === "/" || router.pathname === "/worker/home" ? (
          <HomeIcon color="#3498db" />
        ) : (
          <HomeIconOutlined color="black" />
        )}
        <span
          role="presentation"
          className={clsx(
            "text-sm",
            router.pathname === "/" || router.pathname === "/worker/home"
              ? "text-blueBorder"
              : "text-greyText"
          )}
        >
          Home
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
          Bookings
        </span>
      </button>

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
              ? "text-lightBlue"
              : "text-greyText"
          )}
        >
          Chat
        </span>
      </button>
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
              ? "text-lightBlue"
              : "text-greyText"
          )}
        >
          Favorites
        </span>
      </button>

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
              ? "text-lightBlue"
              : "text-greyText"
          )}
        >
          Profile
        </span>
      </button>
    </div>
  );
}

export default Navbar;
