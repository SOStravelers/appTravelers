import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ClockIcon } from "@/constants/icons";

function WorkerCardChat({ link, name, service, showArrow = true }) {
  return (
    <div
      className="flex py-4 w-full rounded-lg justify-around my-2 items-center"
      style={{ boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.15)" }}
    >
      <Link href={link}>
        <div className="flex">
          <div className="w-20 h-20 rounded-xl bg-azul mr-2 relative">
          <Image
            src={"/assets/proovedor.png"}
            fill
            className="object-cover rounded-xl"
          />
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold">{name}</h1>
            <p className="text-negroTexto">{service}</p>
            <div className="flex items-center">
              <ClockIcon color={"#5B78C7"} className="mr-1" />
              <p className="text-negroTexto text-sm">8 Aug, 2023 | 04:30 PM</p>
            </div>
          </div>
        </div>
      </Link>
      {showArrow ? (
        <Link href={link}>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-azul">
            <ArrowRightIcon className="ml-1" />
          </div>
        </Link>
      ) : (
        <div className="w-10"></div>
      )}
    </div>
  );
}

export default WorkerCardChat;
