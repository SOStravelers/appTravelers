import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { StarIcon, FavIconBorder, ClockIcon, PinIcon } from "@/constants/icons";
import SolidButton from "../buttons/SolidButton";
function WorkerProfileCardChat({
  avatar,
  name,
  location,
  service,
  subservice,
  date,
  time,
  idBooking,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const goToServiceDetails = () => {
    router.push({
      pathname: `/service-details/${idBooking}`,
    });
  };
  return (
    <div className="flex flex-col mx-2 mt-1">
      <div className="flex py-1 w-80 rounded-lg   items-center">
        <div className="w-24 h-24 rounded-2xl mr-2">
          <div className="bg-blueBorder w-20 h-20 rounded-2xl relative">
            <Image
              src={avatar ?? "/assets/proovedor.png"}
              fill
              alt="nuevo"
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center ml-1">
            <h1 className="font-semibold text-black">{name}</h1>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mt-1 ml-2">
              <p className="text-blackText text-sm">
                {service ? service : "No service"} |{" "}
                {subservice ? subservice : "No subservice"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <SolidButton
              py={1}
              text="See Service Details"
              color="blueBorder"
              onClick={goToServiceDetails}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mt-1 ">
          <PinIcon color={"#00A0D5"} className="mr-1" />
          <p className="text-blackText text-sm">
            {location ? location : "No disponible"}
          </p>
        </div>
        <ClockIcon color={"#00A0D5"} className="mr-1 ml-4" />
        <p className="text-blackText text-sm">
          {date} | {time}
        </p>
      </div>
    </div>
  );
}

export default WorkerProfileCardChat;
