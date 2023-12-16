import { PinIcon, ChangeIcon } from "@/constants/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

function HostelCardSummary({ subserviceId, link, name, location, image }) {
  const router = useRouter();

  const handleEditHostel = () => {
    router.push(`/select-hostel/${subserviceId}`);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col">
        <Link href={link}>
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
        </Link>
        <div className="flex justify-between">
          <div className="flex flex-col my-3">
            <Link href={link}>
              <h1 className="font-semibold ml-1">{name ?? "No disponible"}</h1>
            </Link>
            <div className="flex items-center mt-1">
              <PinIcon color={"#00A0D5"} className="mr-1" />
              <p className="text-blackText text-sm">
                {location ? location : "No disponible"}
              </p>
            </div>
          </div>
          <div
            className="w-8 h-20 flex items-center justify-center pr-1 rounded-r-2xl cursor-pointer"
            onClick={handleEditHostel}
          >
            <ChangeIcon className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostelCardSummary;
