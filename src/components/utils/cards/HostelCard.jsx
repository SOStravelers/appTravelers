import { useRouter } from "next/router";
import { useStore } from "@/store";

import { PinIcon, ArrowRightIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCard({ id, link, name, location, img, services }) {
  const router = useRouter();
  const { setService } = useStore();

  const select = () => {
    const editing = localStorage.getItem("editing");
    setService({
      hostelId: id,
      location: location.city,
    });
    if (editing) {
      router.push("/summary");
    } else {
      router.push(link);
    }
  };
  function getServiceNames(services) {
    return services.map((service) => service.service.name).join(", ");
  }

  return (
    <div className="flex  max-w-lg justify-between items-center border-b-2 border-blueBorder rounded-2xl my-2">
      <div className="flex items-center ml-2">
        <Link href={`/hostel/${id}`}>
          <div className="w-20 h-20 rounded-xl relative">
            <Image
              unoptimized
              src={img}
              fill
              className="object-cover rounded-xl"
              alt="Image Location"
            />
          </div>
        </Link>
        <div className="flex flex-col p-2">
          <h1 className="font-semibold ml-1">{name}</h1>
          <div className="flex items-center">
            <PinIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText">{location?.city}</p>
          </div>
          <div className="flex items-center">
            <p className=" ml-1 text-blackText">{getServiceNames(services)}</p>
          </div>
        </div>
      </div>
      <div
        className="w-8 h-24 flex items-center justify-center bg-blueBorder rounded-r-2xl cursor-pointer"
        onClick={select}
      >
        <ArrowRightIcon className="ml-1" />
      </div>
    </div>
  );
}

export default HostelCard;
