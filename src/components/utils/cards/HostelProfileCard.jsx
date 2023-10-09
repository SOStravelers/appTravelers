import Image from "next/image";
import { PinIcon, StarIcon } from "@/constants/icons";

function HostelProfileCard({ name, location, score, avatar }) {
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32  rounded-2xl mr-2">
        <div className="bg-lightBlue w-full h-full rounded-2xl relative">
          <Image
            src={avatar ?? "/assets/lugar.png"}
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold">{name}</h1>
        <div className="flex items-center my-2">
          <PinIcon color={"#0057FF"} className="mr-1" />
          <p className="text-blackText">{location}</p>
        </div>
        <div className="flex items-center">
          <StarIcon color={"#1CDAE5"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText">{`(50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default HostelProfileCard;
