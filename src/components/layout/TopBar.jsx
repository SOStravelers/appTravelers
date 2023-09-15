import Image from "next/image";
import Logo from "../../../public/logo.png";
import { AvatarIcon, NotificationIcon } from "@/constants/icons";

function TopBar() {
  return (
    <div className="w-screen flex items-center justify-between bg-azul h-24 px-5">
      <div className="flex items-center">
        <Image
          className="my-auto mr-2"
          src={Logo}
          width={50}
          height={50}
          alt="logo"
        />
        <div>
          <p className="text-blanco font-semibold text-xl">SOS</p>
          <p className="text-blanco font-semibold text-xl">Travelers</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <NotificationIcon color="#FFFFFF" active={true} className="mr-3" />
        <AvatarIcon color="#FFFFFF" />
      </div>
    </div>
  );
}

export default TopBar;
