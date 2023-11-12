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
          <div className="flex flex-col my-3">
            <h1 className="font-semibold ml-1">
              {name ? name : "No disponible"}
            </h1>
            <div className="flex items-center mt-1">
              <PinIcon color={"#00A0D5"} className="mr-1" />
              <p className="text-blackText text-sm">
                {location ? location : "No disponible"}
              </p>
            </div>
          </div>
          <Link
            className="w-8 h-20 flex items-center justify-center pr-1 rounded-r-2xl cursor-pointer"
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
