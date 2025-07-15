import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SettingsComponent from "../components/settings/Settings";
import { LogoSosRelleno, LogoSosWhite } from "@/constants/icons";
import OptionCard from "@/components/utils/cards/OptionCard";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import languageData from "@/language/settings.json";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { useStore } from "@/store";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function GuestSettings() {
  const store = useStore();
  const router = useRouter();
  const { language } = store;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);
  return (
    <div
      className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
    >
      <Link href="support" className="w-full flex mt-3">
        <OptionCard
          title={languageData.support.title[language]}
          subtitle={languageData.support.body[language]}
          icon={MdEmail}
        />
      </Link>
      <SettingsComponent />

      <div className="flex items-center justify-center mb-5 mt-3">
        <LogoSosRelleno />
      </div>

      <OutlinedButton
        onClick={() => router.push("/register")}
        text={languageData.sigUpButton[language]}
        px={20}
        py={2}
        dark="darkLight"
        textSize="text-sm"
        textColor="text-white"
        buttonCenter={true}
      />
    </div>
  );
}
