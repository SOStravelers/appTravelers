import { PinIcon, ArrowRightIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCard({ id, link, name, location, img }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Link href={`/hostel/${id}`}>
          <div className="w-20 h-20 rounded-xl relative">
            <Image
              src={img}
              fill
              className="object-cover rounded-xl"
              alt="Image Location"
            />
          </div>
        </Link>
        <div className="flex flex-col p-2">
          <h1 className="font-semibold">{name}</h1>
          <div className="flex items-center">
            <PinIcon color={"#3498db"} className="mr-1" />
            <p className="text-blackText">{location.city}</p>
          </div>
        </div>
      </div>
      <Link href={link} className="h-full">
        <div className="w-8 h-24 flex items-center justify-center bg-blueBorder rounded-r-2xl cursor-pointer">
          <ArrowRightIcon className="ml-1" />
        </div>
      </Link>
    </div>
  );
}

export default HostelCard;
