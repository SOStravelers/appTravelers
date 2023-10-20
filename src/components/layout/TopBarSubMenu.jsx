import { useState, useEffect } from "react";
import { ReturnArrowIcon } from "@/constants/icons";
import { useRouter } from "next/router";
import clsx from "clsx";

function TopBarSubMenu() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();

  const actualURL = router.pathname;

  const isSubservices = actualURL.includes("subservices");
  const isHostelSelection = actualURL.includes("select-hostel");
  const isReservation = actualURL.includes("reservation");
  const isWorkersFound = actualURL.includes("workers-found");
  const isSumary = actualURL.includes("summary");
  const isPayment = actualURL.includes("payment");
  const isServiceHistoy = actualURL.includes("service-history");
  const isSettings = actualURL.includes("settings");

  useEffect(() => {
    handleUrl();
  }, [actualURL]);

  const handleUrl = () => {
    if (isSubservices) {
      setTitulo("Select Subservices");
    } else if (isHostelSelection) {
      setTitulo("Select Hostel");
    } else if (isReservation) {
      setTitulo("Reservation");
    } else if (isWorkersFound) {
      setTitulo("Workers Found");
    } else if (isSumary) {
      setTitulo("Summary");
    } else if (isPayment) {
      setTitulo("Payment Method");
    } else if (isServiceHistoy) {
      setTitulo("Service History");
    } else if (isSettings) {
      setTitulo("Settings");
    }
  };

  return (
    <div
      className={clsx(
        "w-screen flex items-center justify-between h-24 px-5 shadow-xl fixed top-0 z-20",
        "bg-darkBlue"
      )}
    >
      <div
        className={clsx(" border-2 rounded-full p-2", "border-white")}
        onClick={() => router.back()}
      >
        <ReturnArrowIcon color={clsx("#fff")} />
      </div>
      <h1 className={clsx(" text-xl", "text-white")}>{titulo}</h1>
      <div className="w-5"></div>
    </div>
  );
}

export default TopBarSubMenu;
