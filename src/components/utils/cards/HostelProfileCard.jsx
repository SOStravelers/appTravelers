import Image from "next/image";
import { PinIcon, StarIcon } from "@/constants/icons";

function HostelProfileCard({ name, location, score, avatar }) {
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32  rounded-2xl mr-2">
        <div className=" w-full h-full rounded-2xl relative">
          <Image
            src={avatar ?? "/assets/lugar.png"}
            fill
            alt="hola"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold ml-2">{name}</h1>
        <div className="flex items-center my-2">
          <PinIcon color={"#00A0D5"} className="pl-1" />
          <p className="text-blackText ml-3">{location}</p>
        </div>
        <div className="flex items-center ml-1">
          <StarIcon color={"#00A0D5"} />
          <p className="text-blackText ml-3">{score}</p>
          <p className="text-blackText">{` (+50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default HostelProfileCard;
