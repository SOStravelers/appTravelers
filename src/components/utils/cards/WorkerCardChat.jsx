import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ClockIcon } from "@/constants/icons";

function WorkerCardChat({
  onClick,
  name,
  service,
  subservice,
  location,
  date,
  time,
  img,
  lastMesssage,
  showArrow,
}) {
  return (
    <div
      className="flex p-1 cursor-pointer w-full max-w-md rounded-2xl md:mt-4 border-b-2 border-blueBorder justify-between my-2 items-center"
      onClick={onClick}
    >
      <div className="flex">
        <div className="w-16 h-16 rounded-xl bg-blueBorder mr-2 relative">
          <Image
            src={img}
            fill
            alt="image"
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col">
          <h1 className=" ml-1 font-semibold">
            {name} | {subservice}
          </h1>
          {/* <p className="text-blackText ml-2">{service}</p> */}
          <div className="flex items-center">
            <ClockIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">
              {date} | {time}
            </p>
          </div>
          <p className=" ml-1 text-blackText font-semibold">{lastMesssage}</p>
        </div>
      </div>

      {showArrow ? (
        <div className="w-3 h-3 flex items-center justify-center rounded-full bg-blueBorder"></div>
      ) : (
        <div className="w-10"></div>
      )}
    </div>
  );
}

export default WorkerCardChat;
