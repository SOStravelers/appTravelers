import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FavButton from "../buttons/FavButton";
import { StarIcon, FavIconBorder } from "@/constants/icons";
import FavoriteService from "@/services/FavoriteService";

function WorkerCardFavorite({ link, name, service, score, image, handleDeleteFav }) {
 

  return (
    <div className="flex py-4 px-5 w-full max-w-lg rounded-2xl border-b-2 border-blueBorder justify-between my-2 items-center">
      <Link href={link}>
        <div className="flex">
          <div className="w-20 h-20 rounded-xl bg-lightBlue mr-2 relative">
            <Image
              src={image}
              fill
              alt="leon"
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold">{name}</h1>
            <p className="text-blackText">{service}</p>
            <div className="flex items-center">
              <StarIcon color={"#00A0D5"} className="mr-1" />
              <p className="text-blackText">{score}</p>
            </div>
          </div>
        </div>
      </Link>
      <div className="w-10 h-10 flex items-center justify-center">
        <FavButton isFavorite={true} handleDeleteFav={handleDeleteFav} />
      </div>
    </div>
  );
}

export default WorkerCardFavorite;
