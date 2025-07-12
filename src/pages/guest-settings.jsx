import { useState, useEffect } from "react";
import SettingsComponent from "../components/settings/Settings";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function GuestSettings() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    delay(250, () => {
      setLoading(false);
    });
  }, []);
  return (
    <div
      className={`min-h-screen bg-backgroundP pt-4 px-6 flex flex-col items-center
    transform transition-all duration-800 ease-out
    transition-opacity duration-800 ease-out
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      <SettingsComponent />
    </div>
  );
}
