import { useRouter } from "next/router";
import Image from "next/image";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import { WorldIcon, MailIcon } from "@/constants/icons";

export default function GuestSettings() {
  const router = useRouter();

  const onFunction = () => {
    console.log("On");
  };

  const offFunction = () => {
    console.log("Off");
  };

  return (
    <div className="flex flex-col py-28 px-10 md:pl-80">
      <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} />
      <OptionCard title="Support" subtitle="Contact us" icon={MailIcon} />
      <div className="flex flex-col my-4">
        <OptionSwitch
          title="Activate Ubication"
          onFunction={onFunction}
          offFunction={offFunction}
        />
      </div>
      <div className="flex items-center justify-center my-5 max-w-lg">
        <Image
          src="/icons/LogoCompleto.svg"
          width={200}
          height={200}
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
