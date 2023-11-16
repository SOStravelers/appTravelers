import Link from "next/link";
import Image from "next/image";
import { PinIcon, ClockIcon } from "@/constants/icons";

function WorkerCardBookingWorker({ link, name, location }) {
  return (
    <div className="flex p-4 w-full max-w-lg rounded-2xl border-b-2 border-blueBorder my-2 items-center">
      <Link href={link}>
        <div className="flex flex-col px-2">
          <h1 className="font-semibold">{name}</h1>
          <div className="flex items-center mb-1">
            <PinIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">{location}</p>
          </div>
          <div className="flex items-center">
            <ClockIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">8 Aug, 2023 | 04:30 PM</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default WorkerCardBookingWorker;
