import { PinIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCard({ link, name, location }) {
  return (
    <Link href={link}>
      <div className="flex w-72 items-center">
        <div className="w-20 h-20 rounded-xl bg-azul relative">
          <Image
            src={"/assets/lugar.png"}
            fill
            className="object-cover rounded-xl"
            alt="Image Location"
          />
        </div>
        <div className="flex flex-col p-2">
          <h1 className="font-semibold">{name}</h1>
          <div className="flex items-center">
            <PinIcon color={"#5B78C7"} className="mr-1" />
            <p className="text-grisTexto">{location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HostelCard;
