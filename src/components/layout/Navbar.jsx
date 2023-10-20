import { useRouter } from "next/router";
import clsx from "clsx";
import {
  HomeIcon,
  BookingIcon,
  ChatIcon,
  FavoriteIcon,
  ProfileIcon,
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
          <HomeIcon
            color={clsx(router.pathname === "/" ? "#3498db" : "#D9D9D9")}
          />
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/" ? "text-lightBlue" : "text-greyText"
            )}
          >
            Home
          </p>
        </button>
      </Link>

      <Link href={isWorker ? "/worker/booking" : "/booking"}>
        <button className="flex flex-col items-center">
          {" "}
          <BookingIcon
            color={clsx(router.pathname === "/booking" ? "#3498db" : "#D9D9D9")}
          />
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/booking"
                ? "text-lightBlue"
                : "text-greyText"
            )}
          >
            Bookings
          </p>
        </button>
      </Link>
      <Link href={isWorker ? "/worker/chat" : "/chat"}>
        <button className="flex flex-col items-center">
          {" "}
          <ChatIcon
            color={clsx(router.pathname === "/chat" ? "#3498db" : "#D9D9D9")}
          />
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/chat" ? "text-lightBlue" : "text-greyText"
            )}
          >
            Chat
          </p>
        </button>
      </Link>
      <Link href={isWorker ? "/worker/favorites" : "/favorites"}>
        <button className="flex flex-col items-center">
          {" "}
          <FavoriteIcon
            color={clsx(
              router.pathname === "/favorites" ? "#3498db" : "#D9D9D9"
            )}
          />
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/favorites"
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
          {" "}
          <ProfileIcon
            color={clsx(router.pathname === "/profile" ? "#3498db" : "#D9D9D9")}
          />
          <p
            className={clsx(
              "text-sm",
              router.pathname === "/profile"
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
