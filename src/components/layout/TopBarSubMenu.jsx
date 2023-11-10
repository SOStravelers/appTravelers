import { useState, useEffect } from "react";
import { ReturnArrowIcon } from "@/constants/icons";
import { useRouter } from "next/router";
import { LogoWhite } from "@/constants/icons";
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
  const isNotifications = actualURL.includes("notifications");
  const isWorkerServices = actualURL.includes("my-services");
  const isProfile = actualURL.includes("profile");
  const isPersonalProfile = actualURL.includes("personal-details");
  const isWorkerProfile = actualURL.includes("worker/profile-config");
  const isMyschedules = actualURL.includes("my-schedules");
  const isAboutMe = actualURL.includes("worker/edit");

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
    } else if (isNotifications) {
      setTitulo("Notifications");
    } else if (isWorkerServices) {
      setTitulo("My Services");
    } else if (isPersonalProfile) {
      setTitulo("Personal Details");
    } else if (isWorkerProfile) {
      setTitulo("My Worker Profile");
    } else if (isMyschedules) {
      setTitulo("My Schedule");
    } else if (isProfile) {
      setTitulo("My Profile");
    } else if (isAboutMe) {
      setTitulo("About Me");
    }
  };

  return (
    <div
      className={clsx(
        "w-screen flex items-center justify-between h-24 px-5 shadow-xl fixed top-0 z-20",
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
      <div style={{ fontSize: "1000px" }}>
        <ReturnArrowIcon color="#fff" size="35" />
      </div>
      <h1 className={clsx(" text-xl", "text-white")}>{titulo}</h1>
      <div className="">
        <LogoWhite color={"white"} />
      </div>
    </div>
  );
}

export default TopBarSubMenu;
