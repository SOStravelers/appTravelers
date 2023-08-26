import Image from "next/image";
import Logo from "../../../public/logo.png";

function TopBar() {
  return (
    <div className="w-screen flex items-center bg-azul h-28 px-5">
      <Image
        className="my-auto absolute"
        src={Logo}
        width={50}
        height={50}
        alt="logo"
      />
    </div>
  );
}

export default TopBar;
