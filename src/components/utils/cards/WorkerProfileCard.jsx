import { StarIcon } from "@/constants/icons";
import Image from "next/image";

function WorkerProfileCard({ name, service, score }) {
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 p-1 border border-black rounded-2xl mr-2">
        <div className="bg-lightBlue w-full h-full rounded-2xl relative">
          <Image
            src={"/assets/proovedor.png"}
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold">{name}</h1>
        <p className="text-blackText my-2">{service}</p>
        <div className="flex items-center">
          <StarIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-blackText">{score}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
