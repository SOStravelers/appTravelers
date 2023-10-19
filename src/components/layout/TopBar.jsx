import { AvatarIcon, NotificationIcon, LogoWhite } from "@/constants/icons";
import { useEffect } from "react";

import Link from "next/link";

import { useStore } from "@/store";

function TopBar() {
  const { loggedIn, user } = useStore();

  const initials = () => {
    if (Object.keys(user).length === 0) return "";
    const { first, last } = user?.personalData?.name;
    const str = `${first.charAt(0)}${last ? last.charAt(0) : ""}`.toUpperCase();
    return str;
  };

  return (
    <div className="w-screen flex items-center justify-between bg-darkBlue h-24 px-5">
      <div className="flex items-center">
        <Link href="/" className="mr-2">
          <LogoWhite color={"white"} />
        </Link>
        <div>
          <p className="text-white font-semibold text-xl">SOS</p>
          <p className="text-white font-semibold text-xl">Travelers</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {loggedIn ? (
          <>
            <NotificationIcon color="#FFFFFF" active={true} className="mr-3" />

            {user.img && user.img.imgUrl ? (
              <Link
                className="rounded-xl"
                href="/profile"
                style={{ width: "40px", height: "40px", overflow: "hidden" }}
              >
                <img
                  src="https://lh3.googleusercontent.com/a/ACg8ocIz-Id4iEHT5RbaBxFPGMtygpl_5qDEdv9G2dhWURDW=s96-c"
                  alt="Descripción de la imagen"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Link>
            ) : (
              <div className="border border-white text-white px-3 py-1 rounded-xl">
                {initials()}
              </div>
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
