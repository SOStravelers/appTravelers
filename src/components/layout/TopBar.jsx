import Image from "next/image";
import Logo from "../../../public/logo.png";
import { AvatarIcon, NotificationIcon, LocationIcon } from "@/constants/icons";

function TopBar() {
  return (
    <div className="w-screen flex items-center justify-between bg-azul h-24 px-5">
      <div className="flex items-center">
        <Image
          className="my-auto mr-5"
          src={Logo}
          width={50}
          height={50}
          alt="logo"
        />
        <div className="flex">
          <LocationIcon color="#FFFFFF" />
          <p className="text-blanco ml-1">Location</p>
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
