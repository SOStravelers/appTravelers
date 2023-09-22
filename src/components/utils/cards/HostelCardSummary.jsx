import { PinIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCardSummary({ link, name, location }) {
  return (
    <Link href={link}>
      <div className="flex flex-col w-72">
        <div className="w-full h-28 rounded-xl bg-lightBlue relative">
          <Image
            src={"/assets/lugar.png"}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col p-2 my-3">
          <h1 className="font-regukar">{name}</h1>
          <div className="flex items-center mt-1">
            <PinIcon color={"#5B78C7"} className="mr-1" />
            <p className="text-greyText text-sm">{location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HostelCardSummary;
