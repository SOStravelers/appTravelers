import { useRouter } from "next/router";
import { useStore } from "@/store";
import Link from "next/link";
import clsx from "clsx";
import {
  HomeIcon,
  BookingIcon,
  ChatIcon,
  FavoriteIcon,
  ProfileIcon,
} from "@/constants/icons";

function Sidebar() {
  const router = useRouter();
  const { isWorker } = useStore();

  return (
    <div
      className="h-full w-60 pt-32 fixed bottom-0 left-0 z-10 bg-darkBlue items-center hidden md:flex flex-col"
      style={{ boxShadow: "2px 2px 34px 0px rgba(0, 0, 0, 0.35)" }}
    >
      <Link className="my-2" href={isWorker ? "/worker/home" : "/"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/" && "bg-lightBlue"
          )}
        >
          <HomeIcon color="white" />
          <p className={clsx("text-xl ml-3 text-white")}>Home</p>
        </button>
      </Link>

      <Link className="my-2" href={isWorker ? "/worker/booking" : "/booking"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/booking" && "bg-lightBlue"
          )}
        >
          <BookingIcon color="#FFFFFF" />
          <p className={clsx("text-xl ml-3 text-white")}>Bookings</p>
        </button>
      </Link>
      <Link className="my-2" href={isWorker ? "/worker/chat" : "/chat"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/chat" && "bg-lightBlue"
          )}
        >
          <ChatIcon color="white" />
          <p className={clsx("text-xl ml-3 text-white")}>Chat</p>
        </button>
      </Link>
      {!isWorker && (
        <Link
          className="my-2"
          href={isWorker ? "/worker/favorites" : "/favorites"}
        >
          <button
            className={clsx(
              "flex items-center pl-5 h-10 w-48 rounded-xl",
              router.pathname === "/favorites" && "bg-lightBlue"
            )}
          >
            <FavoriteIcon color="white" />
            <p className={clsx("text-xl ml-3 text-white")}>Favorites</p>
          </button>
        </Link>
      )}

      <Link className="my-2" href={isWorker ? "/worker/profile" : "/profile"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/profile" && "bg-lightBlue"
          )}
        >
          <ProfileIcon color="white" />
          <p className={clsx("text-xl ml-3 text-white")}>Profile</p>
        </button>
      </Link>
    </div>
  );
}

export default Sidebar;
