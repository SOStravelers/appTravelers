import Image from "next/image";
import { PinIcon, StarIcon } from "@/constants/icons";

function HostelProfileCard({ name, location, score }) {
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 p-1 border border-negro rounded-2xl mr-2">
        <div className="bg-azul w-full h-full rounded-2xl relative">
          <Image
            src={"/assets/lugar.png"}
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold">{name}</h1>
        <div className="flex items-center my-2">
          <PinIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-negroTexto">{location}</p>
        </div>
        <div className="flex items-center">
          <StarIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-negroTexto">{score}</p>
        </div>
      </div>
    </div>
  );
}

export default HostelProfileCard;
