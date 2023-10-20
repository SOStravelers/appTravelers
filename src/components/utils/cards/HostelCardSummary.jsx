import { PinIcon, ChangeIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCardSummary({ subserviceId, link, name, location, image }) {
  return (
    <Link className="w-full max-w-lg" href={link}>
      <div className="flex flex-col">
        <div className="w-full h-28 rounded-xl bg-lightBlue relative">
          <Image
            src={image}
            fill
            alt="buena"
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col p-2 my-3">
            <h1 className="font-regukar">{name}</h1>
            <div className="flex items-center mt-1">
              <PinIcon color={"#5B78C7"} className="mr-1" />
              <p className="text-blackText text-sm">{location}</p>
            </div>
          </div>
          <Link href={`/select-hostel/${subserviceId}`} className="h-full">
            <div className="w-8 h-20 flex items-center justify-centerrounded-r-2xl cursor-pointer">
              <ChangeIcon className="ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default HostelCardSummary;
