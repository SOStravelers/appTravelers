import { useRouter } from "next/router";
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
import Link from "next/link";

function Navbar() {
  const router = useRouter();
  const { isWorker } = useStore();

  return (
    <div
      className="w-screen h-14 fixed bottom-0 left-0 z-10 bg-white flex justify-around items-center md:hidden"
      style={{ boxShadow: "2px 2px 34px 0px rgba(0, 0, 0, 0.35)" }}
    >
      <Link href={isWorker ? "/worker/home" : "/"}>
        <button className="flex flex-col items-center">
          {router.pathname === "/" || router.pathname === "/worker/home" ? (
            <HomeIcon color="#3498db" />
          ) : (
            <HomeIconOutlined color="black" />
          )}
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/" || router.pathname === "/worker/home"
                ? "text-lightBlue"
                : "text-greyText"
            )}
          >
            Home
          </p>
        </button>
      </Link>

      <Link href={isWorker ? "/worker/booking" : "/booking"}>
        <button className="flex flex-col items-center">
          {router.pathname.includes("booking") ? (
            <BookingIcon color="#3498db" />
          ) : (
            <BookingIconOutlined color="black" />
          )}
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/booking" ||
                router.pathname === "/worker/booking"
                ? "text-red"
                : "text-greyText"
            )}
          >
            Bookings
          </p>
        </button>
      </Link>
      <Link href={isWorker ? "/worker/chat" : "/chat"}>
        <button className="flex flex-col items-center">
          {router.pathname.includes("chat") ? (
            <ChatIcon color="#3498db" />
          ) : (
            <ChatIconOutlined color="black" />
          )}
          <p
            className={clsx(
              "text-sm",
              router.pathname.includes("chat")
                ? "text-lightBlue"
                : "text-greyText"
            )}
          >
            Chat
          </p>
        </button>
      </Link>
      <Link href={isWorker ? "/worker/favorites" : "/favorites"}>
        <button className="flex flex-col items-center">
          {router.pathname.includes("favorites") ? (
            <FavoriteIcon color="#3498db" />
          ) : (
            <FavoriteIconOutlined color="black" />
          )}

          <p
            className={clsx(
              "text-sm",
              router.pathname.includes("favorites")
                ? "text-lightBlue"
                : "text-greyText"
            )}
          >
            Favorites
          </p>
        </button>
      </Link>

      <Link href={isWorker ? "/worker/profile" : "/profile"}>
        <button className="flex flex-col items-center">
          {router.pathname.includes("profile") ? (
            <ProfileIcon color="#3498db" />
          ) : (
            <ProfileIconOutlined color="black" />
          )}

          <p
            className={clsx(
              "text-sm",
              router.pathname.includes("profile")
                ? "text-lightBlue"
                : "text-greyText"
            )}
          >
            Profile
          </p>
        </button>
      </Link>
    </div>
  );
}

export default Navbar;
