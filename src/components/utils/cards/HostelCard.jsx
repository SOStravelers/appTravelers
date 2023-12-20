import { useRouter } from "next/router";
import { useStore } from "@/store";
import { useState, useEffect } from "react";

import { PinIcon, ArrowRightIcon } from "@/constants/icons";
import Link from "next/link";
import Image from "next/image";

function HostelCard({ id, link, name, editing, location, img, services }) {
  const router = useRouter();
  const { setService } = useStore();
  const [newLink, setNewLink] = useState(link);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (editing) {
      setNewLink("/summary");
    } else {
      setNewLink(link);
    }
  }, []);

  const select = () => {
    console.log("apretando select");
    setService({
      hostelId: id,
      location: location.city,
    });
    router.push(newLink);
  };
  function getServiceNames(services) {
    return services.map((service) => service.service.name).join(", ");
  }
  function truncate(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  return (
    <div
      onClick={select}
      className="flex  max-w-lg justify-between items-center border-b-2 border-blueBorder rounded-2xl my-2"
    >
      <div className="flex items-center ml-2">
        <Link href={`/hostel/${id}`}>
          <div
            className="w-20 h-20 rounded-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
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
          <h1 className="font-semibold ml-1">
            {" "}
            {width < 420 ? truncate(name, 20) : name}
          </h1>
          <div className="flex items-center">
            <PinIcon color={"#00A0D5"} className="mr-1 text-xs" />
            <p className="text-blackText">{location?.city}</p>
          </div>
          <div className="flex items-center">
            <p className=" ml-1 text-xs text-blackText">
              {width < 420
                ? truncate(getServiceNames(services), 26)
                : getServiceNames(services)}
            </p>
          </div>
        </div>
      </div>
      <div className="w-8 h-24 flex items-center justify-center bg-blueBorder rounded-r-2xl cursor-pointer">
        <ArrowRightIcon className="ml-1" />
      </div>
    </div>
  );
}

export default HostelCard;
