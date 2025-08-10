// components/layout/Navbar.jsx
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";
import clsx from "clsx";
import NotificationService from "@/services/NotificationService";
import languageData from "@/language/menu.json";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import {
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaCog,
  FaRegSun,
} from "react-icons/fa";
import { PiHouseFill, PiHouse } from "react-icons/pi";
import { RequestIcon, RequestIconOutlined } from "@/constants/icons";
import { useStore } from "@/store";

function Navbar() {
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(false);
  const userCookie = Cookies.get("auth.user_id");
  const {
    isWorker,
    user,
    setHaveNotification,
    language,
    setService,
    loggedIn,
  } = useStore();

  // ---- Avatar: cache + fallback ----
  const [avatarSrc, setAvatarSrc] = useState(null); // URL o dataURL
  const [avatarError, setAvatarError] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  // Placeholder base64 (blur)
  const blurDataURL =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  const buildAvatarKey = useCallback(() => {
    if (!user?._id) return null;
    const version = user?.img?.version || "1"; // si tienes versionado, úsalo
    return `avatar:${user._id}:v${version}`;
  }, [user?._id, user?.img?.version]);

  useEffect(() => {
    const url = user?.img?.imgUrl;
    const key = buildAvatarKey();

    setAvatarLoaded(false);
    setAvatarError(false);

    if (!loggedIn || !url || !key) {
      setAvatarSrc(null);
      return;
    }

    // 1) intenta cache local
    try {
      const cached =
        typeof window !== "undefined" ? localStorage.getItem(key) : null;
      if (cached) {
        setAvatarSrc(cached);
        return;
      }
    } catch {
      // ignore quota/localStorage error
    }

    // 2) intenta descargar y guardar en base64
    (async () => {
      try {
        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) throw new Error("fetch avatar failed");
        const blob = await res.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          setAvatarSrc(dataUrl);
          try {
            localStorage.setItem(key, dataUrl);
          } catch {
            // ignore quota
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        // 3) fallback: usa la URL directa (el browser cachea igual)
        setAvatarSrc(url);
      }
    })();
  }, [loggedIn, user?.img?.imgUrl, buildAvatarKey]);

  // Navegación
  const goTo = (ruta) => {
    if (!loggedIn && ruta !== "/" && ruta !== "/profile") {
      setOpenLogin(true);
      return;
    }
    setService({});
    if (ruta !== "/" && ruta !== "/worker/home") {
      checkNotification();
    }
    router.push(ruta);
  };

  const goProfile = () => {
    if (!loggedIn) {
      router.push("/guest-settings");
    } else {
      goTo(isWorker ? "/worker/profile" : "/profile");
    }
  };

  const checkNotification = async () => {
    try {
      if (!loggedIn) return;
      const response = await NotificationService.checkNotification();
      setHaveNotification(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const initials = () => {
    if (!loggedIn) return "";
    const name = user?.personalData?.name;
    if (!name) return "";
    const { first = "", last = "" } = name;
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const isHome = router.pathname === "/" || router.pathname === "/worker/home";
  const isBooking = router.pathname.includes("booking");
  const isFavorites = router.pathname.includes("favorites");
  const isRequests = router.pathname.includes("/worker/requests");
  const isProfile =
    router.pathname.includes("profile") ||
    router.pathname === "/guest-settings";

  const isDataUrl =
    typeof avatarSrc === "string" && avatarSrc.startsWith("data:");

  return (
    <div className="w-screen h-12 fixed bottom-0 left-0 z-30 bg-backgroundNavbar flex justify-around items-center md:hidden">
      {/* Home */}
      <button
        className="customButton flex mt-1 flex-col items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/home" : "/")}
      >
        {isHome ? (
          <span className="text-blueBorder">
            <PiHouseFill size={24} />
          </span>
        ) : (
          <span className="text-textColorGray">
            <PiHouse size={24} />
          </span>
        )}
        <span
          role="presentation"
          style={{ marginTop: "-2px" }}
          className={clsx(
            "text-xs",
            isHome ? "text-blueBorder" : "text-textColorGray"
          )}
        >
          {languageData.home[language]}
        </span>
      </button>

      {/* Bookings */}
      <button
        className="flex mt-1 flex-col items-center justify-center"
        onClick={() => goTo(isWorker ? "/worker/booking" : "/booking")}
      >
        {isBooking ? (
          <FaCalendarAlt size={22} color="#3498db" />
        ) : (
          <FaRegCalendarAlt size={22} className="text-textColorGray" />
        )}
        <span
          role="presentation"
          className={clsx(
            "text-xs",
            isBooking ? "text-blueBorder" : "text-textColorGray"
          )}
        >
          {languageData.bookings[language]}
        </span>
      </button>

      {/* Favorites / Requests */}
      {!isWorker ? (
        <button
          className="flex mt-1 flex-col items-center justify-center"
          onClick={() => goTo("/favorites")}
        >
          {isFavorites ? (
            <span className="text-blueBorder">
              <FaHeart size={22} />
            </span>
          ) : (
            <span className="text-textColorGray">
              <FaRegHeart size={22} />
            </span>
          )}
          <span
            role="presentation"
            className={clsx(
              "text-xs",
              isFavorites ? "text-blueBorder" : "text-textColorGray"
            )}
          >
            {languageData.favorites[language]}
          </span>
        </button>
      ) : (
        <button
          className="flex mt-1 flex-col items-center justify-center"
          onClick={() => goTo("/worker/requests")}
        >
          {isRequests ? (
            <RequestIcon color="#3498db" />
          ) : (
            <RequestIconOutlined color="black" />
          )}
          <span
            role="presentation"
            className={clsx(
              "text-sm",
              isRequests ? "text-blueBorder" : "text-greyText"
            )}
          >
            Trabalhos
          </span>
        </button>
      )}

      {/* Profile / Settings */}
      <button
        className="flex mt-1 flex-col items-center justify-center"
        onClick={goProfile}
      >
        {loggedIn ? (
          // Avatar o Iniciales
          avatarSrc && !avatarError ? (
            <>
              <div
                className={clsx(
                  "rounded-md overflow-hidden",
                  avatarLoaded ? "" : "opacity-80"
                )}
                style={{ width: 24, height: 24 }}
              >
                {isDataUrl ? (
                  // dataURL => usar <img> para evitar warning
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-md object-cover"
                    loading="eager"
                    decoding="async"
                    onError={() => setAvatarError(true)}
                    referrerPolicy="no-referrer"
                    onLoad={() => setAvatarLoaded(true)}
                  />
                ) : (
                  // URL normal => usar <Image> optimizado
                  <Image
                    src={avatarSrc}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="rounded-md object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    onLoadingComplete={() => setAvatarLoaded(true)}
                    onError={() => setAvatarError(true)}
                  />
                )}
              </div>
              <span
                role="presentation"
                className={clsx(
                  "text-xs",
                  isProfile ? "text-blueBorder" : "text-textColorGray"
                )}
              >
                {languageData.profile[language]}
              </span>
            </>
          ) : (
            <>
              <div
                className={clsx(
                  "flex items-center justify-center text-sm rounded-md",
                  isProfile
                    ? "text-white bg-blueBorder border-blueBorder"
                    : "text-textColorGray border-gray-500"
                )}
                style={{
                  width: 28,
                  height: 28,
                  overflow: "hidden",
                  borderWidth: 1.5,
                }}
              >
                {initials()}
              </div>
              <span
                role="presentation"
                className={clsx(
                  "text-xs",
                  isProfile ? "text-blueBorder" : "text-textColorGray"
                )}
              >
                {languageData.profile[language]}
              </span>
            </>
          )
        ) : (
          <div className="flex mt-1 flex-col items-center justify-center">
            {isProfile ? (
              <span className="text-blueBorder">
                <FaCog size={22} />
              </span>
            ) : (
              <span className="text-textColorGray">
                <FaRegSun size={22} />
              </span>
            )}
            <span
              role="presentation"
              className={clsx(
                "text-xs",
                isProfile ? "text-blueBorder" : "text-textColorGray"
              )}
            >
              Config
            </span>
          </div>
        )}
      </button>

      {/* Modal login */}
      {!loggedIn && (
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
