import Link from "next/link";
import Image from "next/image";
import { PinIcon, ClockIcon } from "@/constants/icons";

function WorkerCardBooking({ link, name, location }) {
  return (
    <div className="flex p-4 w-full rounded-2xl border-b-2 border-blueBorder items-center">
      <Link href={link}>
        <div className="flex">
          <div className="w-20 h-20 rounded-xl bg-lightBlue mr-2 relative">
            <Image
              src={"/assets/proovedor.png"}
              fill
              alt="buenos"
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold">{name}</h1>
            <div className="flex items-center mb-1">
              <PinIcon color={"#0057FF"} className="mr-1" />
              <p className="text-blackText text-sm">{location}</p>
            </div>
            <div className="flex items-center">
              <ClockIcon color={"#5B78C7"} className="mr-1" />
              <p className="text-blackText text-sm">8 Aug, 2023 | 04:30 PM</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default WorkerCardBooking;
