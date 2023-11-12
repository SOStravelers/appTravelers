import { PinIcon, ChangeIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCardSummary({ subserviceId, link, name, location, image }) {
  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col">
        <div className="w-full h-28 rounded-xl bg-lightBlue relative">
          {image && (
            <Image
              src={image}
              fill
              alt="imagenCover"
              className="object-cover rounded-xl"
            />
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col p-2 my-3">
            <h1 className="font-regukar">{name}</h1>
            <div className="flex items-center mt-1">
              <PinIcon color={"#5B78C7"} className="mr-1" />
              <p className="text-blackText text-sm">
                {location ? location : "No disponible"}
              </p>
            </div>
          </div>
          <Link
            className="w-8 h-20 flex items-center justify-center rounded-r-2xl cursor-pointer"
            href={`/select-hostel/${subserviceId}`}
          >
            <ChangeIcon className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HostelCardSummary;
