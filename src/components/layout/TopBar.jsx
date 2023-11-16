import {
  AvatarIcon,
  NotificationIcon,
  NotificationOffIcon,
  LogoWhite,
} from "@/constants/icons";
import { useEffect } from "react";
import { random } from "@/lib/utils";

import Link from "next/link";

import { useStore } from "@/store";
function TopBar() {
  const { loggedIn, user, isWorker } = useStore();

  const initials = () => {
    if (user && Object.keys(user).length === 0) return "";
    const { first, last } = user?.personalData?.name;
    const str = `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
    return str;
  };

  return (
    <div className="w-screen z-20 lg:px-10 xl:px-10 flex items-center justify-between bg-darkBlue h-20 lg:h-20 xl:h-20 px-3 fixed top-0">
      <div className="flex items-center">
        <Link
          href="/"
          style={{ textDecoration: "none", color: "inherit" }}
          className="mr-2"
        >
          <LogoWhite
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              "&:focus": { outline: "none" },
            }}
            color={"white"}
          />
        </Link>
        <div>
          <p className="text-white font-semibold text-xl">SOS</p>
          <p className="text-white font-semibold text-xl">Travelers</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {loggedIn ? (
          <>
            {isWorker && (
              <h1 className="text-white mr-5 neon-green text-xs sm:text-base md:text-lg lg:text-lg xl:text-lg">
                Worker Mode
              </h1>
            )}
            <Link href="/notifications">
              <NotificationOffIcon
                color="#FFFFFF"
                className="mr-3 cursor-pointer"
              />
            </Link>

            {user.img && user.img.imgUrl ? (
              <Link
                className="rounded-xl"
                href="/profile"
                style={{ width: "40px", height: "40px", overflow: "hidden" }}
              >
                <img
                  src={user.img.imgUrl + "?hola=" + random()}
                  alt="Descripción de la imagen"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Link>
            ) : (
              <Link
                href="/profile"
                className="border border-white text-white px-3 py-1 rounded-xl"
              >
                {initials()}
              </Link>
            )}
          </>
        ) : (
          <>
            <Link className="text-white mr-2" href="/login">
              Sign In
            </Link>
            <Link
              className="text-white border border-white px-3 py-1 rounded-xl"
              href="/register"
            >
              Join
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;
