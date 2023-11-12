import Link from "next/link";
import Image from "next/image";
import { StarIcon, ChangeIcon } from "@/constants/icons";

function WorkerCardSumary({ link, name, service, score, img, hostelId }) {
  return (
    <div className="flex py-4 w-full max-w-lg rounded-lg justify-between my-2 items-center">
      <div className="flex">
        <div className="w-20 h-20 rounded-xl bg-lightBlue mr-2 relative">
          <Link href={link}>
            {img ? (
              <Image
                src={img}
                fill
                alt="imagenWorker"
                className="object-cover rounded-xl"
              />
            ) : null}
          </Link>
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold">{name}</h1>
          <p className="text-blackText text-sm">{service}</p>
          <div className="flex items-center">
            <StarIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText">{score}</p>
          </div>
        </div>
      </div>

      <Link href={`/workers-found/${hostelId}`} className="h-full">
        <div className="w-8 h-20 flex items-center justify-centerrounded-r-2xl cursor-pointer">
          <ChangeIcon className="ml-1" />
        </div>
      </Link>
    </div>
  );
}

export default WorkerCardSumary;
