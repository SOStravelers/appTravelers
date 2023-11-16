import { useState } from "react";
import Image from "next/image";
import FavButton from "@/components/utils/buttons/FavButton";
import { StarIcon } from "@/constants/icons";
import { random } from "@/lib/utils";

function WorkerProfileCard({ name, services, score, avatar }) {
  const [fav, setFav] = useState(false);
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 rounded-2xl mr-2">
        <div className="bg-lightBlue w-full h-full rounded-2xl relative">
          <Image
            src={avatar + "?hola=" + random() ?? "/assets/proovedor.png"}
            fill
            alt="nuevo"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <FavButton fav={fav} setFav={setFav} />
          <h1 className="font-semibold text-black">{name}</h1>
        </div>
        <p className="text-blackText my-2">
          {services?.map((service) => service.id.name).join(", ")}
        </p>
        <div className="flex items-center">
          <StarIcon color={"#00A0D5"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText">{`(50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
