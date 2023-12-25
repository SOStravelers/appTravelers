import { NotificationOffIcon, LogoWhite } from "@/constants/icons";
import { useEffect } from "react";
import { random } from "@/lib/utils";

import Link from "next/link";

import { useStore } from "@/store";
function TopBar() {
  const { loggedIn, user, isWorker, setUser } = useStore();

  useEffect(() => {
    if (user != undefined && user.img && user.img.imgUrl) {
      let newUser = { ...user };
      newUser.img.imgUrl = user.img.imgUrl + "?hola=" + random();
      setUser[newUser];
    }
  }, [user]);
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
    <div className="w-screen z-20 lg:px-10 xl:px-10 flex items-center justify-between bg-darkBlue h-18   lg:h-20 xl:h-20 px-3 fixed top-0">
      <div className="flex items-center">
        <Link
          href="/"
          style={{ textDecoration: "none", color: "inherit" }}
          className="mr-2 my-2"
        >
          <LogoWhite
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              "&:focus": { outline: "none" },
              fontSize: "0.5rem", // Ajusta el tamaño del texto según tus necesidades
            }}
            color={"white"}
          />
        </Link>
        <div>
          <p className="text-white font-semibold text-lg">SOS</p>
          <p
            style={{ marginTop: "-12px" }}
            className="text-white font-semibold text-lg"
          >
            Travelers
          </p>
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
            <Link href="/notifications" className="lg:mx-5 xl:mx-5">
              <NotificationOffIcon
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:focus": { outline: "none" },
                  fontSize: "0.1rem", // Ajusta el tamaño del texto según tus necesidades
                }}
                color="#FFFFFF"
                className="mr-3 cursor-pointer"
              />
            </Link>

            {user?.img && user?.img.imgUrl ? (
              <Link
                className="rounded-xl"
                href={profileUrl}
                style={{ width: "40px", height: "40px", overflow: "hidden" }}
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
                className="border border-white text-white px-3 py-2 rounded-xl"
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
