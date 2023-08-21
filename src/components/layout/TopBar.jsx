import Image from "next/image";
import Logo from "../../../public/logo.png";

function TopBar() {
  return (
    <div className="w-screen flex justify-center items-center h-40 bg-azul">
      <Image className="my-auto" src={Logo} alt="logo" />
    
    </div>
  );
}

export default TopBar;
