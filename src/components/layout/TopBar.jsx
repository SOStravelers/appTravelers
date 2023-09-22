import { AvatarIcon, NotificationIcon, LogoWhite } from "@/constants/icons";
import Link from "next/link";

function TopBar() {
  return (
    <div className="w-screen flex items-center justify-between bg-darkBlue h-24 px-5">
      <div className="flex items-center">
        <div className="mr-2">
          <LogoWhite color={"white"} />
        </div>
        <div>
          <p className="text-white font-semibold text-xl">SOS</p>
          <p className="text-white font-semibold text-xl">Travelers</p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {/* <NotificationIcon color="#FFFFFF" active={true} className="mr-3" />
        <div className="border border-white text-white px-3 py-1 rounded-xl">
          RR
        </div>*/}
        <Link className="text-white mr-2" href="/login">
          Sing In
        </Link>
        <Link
          className="text-white border border-white px-3 py-1 rounded-xl"
          href="/login"
        >
          Join
        </Link>
      </div>
    </div>
  );
}

export default TopBar;
