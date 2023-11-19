import { useRouter } from "next/router";
import { useStore } from "@/store";
import Link from "next/link";
import clsx from "clsx";
import {
  HomeIconOutlined,
  BookingIconOutlined,
  ChatIconOutlined,
  FavoriteIconOutlined,
  ProfileIconOutlined,
} from "@/constants/icons";

function Sidebar() {
  const router = useRouter();
  const { isWorker } = useStore();
  const handleClick = () => {
    router.push(isWorker ? "/worker/home" : "/");
  };

  return (
    <div
      className="h-full w-60 pt-32 fixed bottom-0 left-0 z-10 bg-darkBlue items-center hidden md:flex flex-col"
      style={{ boxShadow: "2px 2px 34px 0px rgba(0, 0, 0, 0.35)" }}
    >
       <Link className="my-2" href={isWorker ? "/" : "/worker/home"}>
      <button
        className={clsx(
          "flex items-center pl-5 h-10 w-48 rounded-xl transition-all duration-300 ease-in-out",
          router.pathname === "/" || router.pathname === "/worker/home"
            ? "bg-newBlue"
            : "bg-someOtherColor"
        )}
        onClick={handleClick}
      >
        <HomeIconOutlined color="white" />
        <p className={clsx("text-xl ml-3 text-white")}>Home</p>
      </button>
      </Link>

      <Link className="my-2" href={isWorker ? "/worker/booking" : "/booking"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/booking" ||
              router.pathname === "/worker/booking"
              ? "bg-newBlue"
              : "bg-someOtherColor"
          )}
        >
          <BookingIconOutlined color="#FFFFFF" />
          <p className={clsx("text-xl ml-3 text-white")}>Bookings</p>
        </button>
      </Link>
      <Link className="my-2" href={isWorker ? "/worker/chat" : "/chat"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/chat" || router.pathname === "/worker/chat"
              ? "bg-newBlue"
              : "bg-someOtherColor"
          )}
        >
          <ChatIconOutlined color="white" />
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
              router.pathname === "/favorites"
                ? "bg-newBlue"
                : "bg-someOtherColor"
            )}
          >
            <FavoriteIconOutlined color="white" />
            <p className={clsx("text-xl ml-3 text-white")}>Favorites</p>
          </button>
        </Link>
      )}

      <Link className="my-2" href={isWorker ? "/worker/profile" : "/profile"}>
        <button
          className={clsx(
            "flex items-center pl-5 h-10 w-48 rounded-xl",
            router.pathname === "/profile" ||
              router.pathname === "/worker/profile"
              ? "bg-newBlue"
              : "bg-someOtherColor"
          )}
        >
          <ProfileIconOutlined color="white" />
          <p className={clsx("text-xl ml-3 text-white")}>Profile</p>
        </button>
      </Link>
    </div>
  );
}

export default Sidebar;
