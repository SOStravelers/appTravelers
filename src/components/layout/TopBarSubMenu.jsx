import Image from "next/image";
import Logo from "../../../public/logo.png";
import { ReturnArrowIcon } from "@/constants/icons";

function TopBarSubMenu() {
  return (
    <div className="w-screen flex items-center justify-between bg-azul h-24 px-5">
     <ReturnArrowIcon color="#fff" />
    </div>
  );
}

export default TopBarSubMenu;
