import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { WorldIcon, MailIcon } from "@/constants/icons";

export default function GuestSettings() {
  const router = useRouter();
  const [isOnUbication, setIsOnUbication] = useState(false);

  const onFunction = () => {
    console.log("On");
  };

  const offFunction = () => {
    console.log("Off");
  };

  return (
    <div className="flex flex-col py-24 px-10 md:pl-80">
      <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} />
      <OptionCard title="Support" subtitle="Contact us" icon={MailIcon} />
      <div className="flex flex-col my-4">
        <OptionSwitch
          title="Activate Ubication"
          onFunction={onFunction}
          offFunction={offFunction}
          isOn={isOnUbication}
          setIsOn={setIsOnUbication}
        />
      </div>
      <div className="flex items-center justify-center mb-4  max-w-lg">
        <Image
          src="/icons/LogoCompleto.svg"
          width={120}
          height={120}
          alt="SOS Traveler Logo"
        />
      </div>

      <OutlinedButton
        text="Register Now"
        onClick={() => router.push("/register")}
      />
    </div>
  );
}
