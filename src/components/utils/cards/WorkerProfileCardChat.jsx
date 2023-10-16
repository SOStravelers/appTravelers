import Image from "next/image";
import { StarIcon, FavIconBorder, ClockIcon } from "@/constants/icons";
import SolidButton from "../buttons/SolidButton";

function WorkerProfileCardChat({ name, service, score }) {
  return (
    <div className="flex py-4 w-full rounded-lg my-2 items-center">
      <div className="w-36 h-36 p-1 border border-black rounded-2xl mr-2">
        <div className="bg-lightBlue w-full h-full rounded-2xl relative">
        <Image
            src={"/assets/proovedor.png"}
            fill
            alt="otro alt"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <h1 className="font-semibold">{name}</h1>
          <FavIconBorder color={"#000000"} className="ml-1 h-6" />
        </div>
        <p className="text-blackText">{service}</p>
        <div className="flex items-center">
          <StarIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-blackText">{score}</p>
        </div>
        <div className="flex items-center">
          <ClockIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-blackText text-sm">8 Aug, 2023 | 04:30 PM</p>
        </div>
        <SolidButton color="grey" text={"Service Resume"} py={2} />
      </div>
    </div>
  );
}

export default WorkerProfileCardChat;
