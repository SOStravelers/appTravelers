import { PinIcon } from "@/constants/icons";
import Link from "next/link";

function HostelCardSummary({ link, name, location }) {
  return (
    <Link href={link}>
      <div className="flex flex-col w-72">
        <div className="w-full h-28 rounded-xl bg-azul"></div>
        <div className="flex flex-col p-2 my-3">
          <h1 className="font-regukar">{name}</h1>
          <div className="flex items-center mt-1">
            <PinIcon color={"#5B78C7"} className="mr-1" />
            <p className="text-grisTexto text-sm">{location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default HostelCardSummary;
