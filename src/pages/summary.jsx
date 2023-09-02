import WorkerCard from "@/components/utils/cards/WorkerCard";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import SolidButton from "@/components/utils/buttons/SolidButton";
import Link from "next/link";
import { ClockIcon, EditIcon } from "@/constants/icons";

export default function Summary() {
  return (
    <div className="flex flex-col px-10 items-center">
      <h1 className="my-5 text-gris text-center">
        Read all the points carefully and make sure that it is what you need.
      </h1>
      <HostelCardSummary
        name={"Nombre hostal"}
        location={"Ubicación"}
        link={"/hostel/" + 1}
      />
      <WorkerCard
        name={"Nombre trabajador"}
        service={"Barbero"}
        score={5}
        link={"/worker/" + 1}
        showArrow={false}
      />
      <div className="flex justify-between w-full my-5">
        <div className="flex ">
          <ClockIcon />
          <p className="ml-2">4 Aug, 2023 | 04:30 PM</p>
        </div>
        <EditIcon />
      </div>
      <div className="flex w-full my-5">
        <input type="checkbox" className="mr-2" />
        <p className="text-negroTexto">Accept terms & conditions of SOS</p>
      </div>
      <div className="flex justify-between items-end w-full my-5">
        <p className="text-negroTexto font-semibold">Total Service Fee</p>
        <p className="text-azul font-semibold text-2xl">$ 100.00</p>
      </div>
      <Link href={"/payment"} className="w-full">
        <SolidButton text={"Hire Now"} />
      </Link>
    </div>
  );
}
