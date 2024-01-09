import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import FavButton from "../buttons/FavButton";
import { useStore } from "@/store";
import { StarIcon, ArrowRightIcon } from "@/constants/icons";
import FavoriteService from "@/services/FavoriteService";
import local from "next/font/local";

function WorkerCardFavorite({
  link,
  name,
  services,
  score,
  image,
  showArrow = true,
  id,
}) {
  const { setService } = useStore();
  const router = useRouter();

  const handleWorkerSelection = () => {
    setService({ workerId: id });
    localStorage.setItem("fromFavorite", true);
    router.push({
      pathname: `/services/${id}`,
    });
  };

  const getServices = () => {
    let servicesString = "";
    services?.forEach((service, index) => {
      if (index === 0) {
        servicesString += service.id.name;
      } else {
        servicesString += ", " + service.id.name;
      }
    });
    return servicesString;
  };

  return (
    <div
      onClick={handleWorkerSelection}
      className="flex w-full max-w-lg rounded-2xl border-b-2 border-blueBorder justify-between my-2 items-center"
    >
      <div className="flex">
        <div
          className="w-20 h-20 rounded-xl   mr-2 ml-3 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={link}>
            {image && (
              <Image
                src={image}
                alt="image"
                fill
                className="object-cover rounded-xl"
              />
            )}
          </Link>
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold">{name}</h1>
          <p className="text-blackText">{getServices()}</p>
          <div className="flex items-center">
            <StarIcon color={"#1CDAE5"} className="mr-1" />
            <p className="text-blackText">{score}</p>
          </div>
        </div>
      </div>
      {showArrow ? (
        <div className="w-8 h-24 flex items-center justify-center bg-blueBorder rounded-r-2xl cursor-pointer">
          <ArrowRightIcon className="ml-1" />
        </div>
      ) : (
        <div className="w-10"></div>
      )}
    </div>
  );
}

export default WorkerCardFavorite;
