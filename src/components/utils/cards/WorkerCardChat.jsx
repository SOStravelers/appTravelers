import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ClockIcon } from "@/constants/icons";

function WorkerCardChat({ onClick, name, service,img, showArrow = true }) {
  return (
    <div className="flex p-4 cursor-pointer w-full max-w-md rounded-2xl border-b-2 border-blueBorder justify-between my-2 items-center" onClick={onClick}>
     
        <div className="flex">
          <div className="w-20 h-20 rounded-xl bg-blueBorder mr-2 relative">
            <Image
              src={img}
              fill
              alt="cosa"
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold">{name}</h1>
            <p className="text-blackText">{service}</p>
            <div className="flex items-center">
              <ClockIcon color={"#00A0D5"} className="mr-1" />
              <p className="text-blackText text-sm">8 Aug, 2023 | 04:30 PM</p>
            </div>
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
