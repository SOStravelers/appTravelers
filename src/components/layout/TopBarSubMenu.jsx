import { useState, useEffect, useRef } from "react";
import { ReturnArrowIcon } from "@/constants/icons";
import { useRouter } from "next/router";
import { LogoWhite } from "@/constants/icons";
import clsx from "clsx";
import Link from "next/link";
import { useStore } from "@/store";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { routeTitles } from "@/constants/index";

function TopBarSubMenu() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();
  const socket = useRef();
  const { isWorker } = useStore();
  var userId = Cookies.get("auth.user_id");
  useEffect(() => {
    if (isWorker) {
      console.log("conect socket worker");
      const host = process.env.NEXT_PUBLIC_API_SOCKET_IO;
      socket.current = io(host);
      socket.current.emit("add-user", userId);

      socket.current.on("booking-recieve", (data) => {
        console.log("booking recibido", data);
        setBooking(data.data);
        sound.play();
        setOpenWorkerModal(true);
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [isWorker]);
  const actualURL = router.pathname;
  useEffect(() => {
    handleUrl();
  }, [actualURL, routeTitles]);

  const handleUrl = () => {
    Object.keys(routeTitles).forEach((route) => {
      if (actualURL.includes(route)) {
        setTitulo(routeTitles[route]);
      }
    });
  };

  return (
    <div
      className={clsx(
        "w-screen flex items-center justify-between h-18 lg:h-20 xl:h-20 lg:px-20 xl:px-20  px-5 shadow-xl fixed top-0 z-20",
        "bg-darkBlue"
      )}
    >
      {/* <div
        className={clsx(
          " border-2 rounded-full p-2 border-white cursor-pointer"
        )}
        onClick={() => router.back()}
      >
        <ReturnArrowIcon color={clsx("#fff")} />
      </div> */}
      <div onClick={() => router.back()}>
        <ReturnArrowIcon color="#fff" size="35" />
      </div>
      <h1 className={clsx(" text-xl", "text-white")}>{titulo}</h1>
      <Link className="my-2" href={isWorker ? "/worker/home" : "/"}>
        <LogoWhite
          style={{
            textDecoration: "none",
            color: "inherit",
            "&:focus": { outline: "none" },
            fontSize: "0.5rem", // Ajusta el tamaño del texto según tus necesidades
          }}
          color={"white"}
        />
      </Link>
    </div>
  );
}

export default TopBarSubMenu;
