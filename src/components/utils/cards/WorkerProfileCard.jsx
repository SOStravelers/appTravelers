import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import FavButton from "@/components/utils/buttons/FavButton";
import { StarIcon } from "@/constants/icons";
import { random } from "@/lib/utils";
import FavoriteService from "@/services/FavoriteService";

function WorkerProfileCard({ name, services, score, avatar }) {
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getFavorites();
  }, []);

  const getFavorites = async () => {
    try {
      const response = await FavoriteService.listFavorites();
      if (response?.data?.length > 0) {
        setFavorites(response?.data);
        const isFavorite = response?.data?.some(
          (favorite) => favorite.receptor._id === router.query.id
        );
        setIsFavorite(isFavorite);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetFav = async () => {
    console.log(router.query.id);
    try {
      const response = await FavoriteService.addFavorite(router.query.id);
      if (response?.data?.emisor) {
        setIsFavorite(true);
        setFavorites([...favorites, response?.data]);
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFav = async () => {
    try {
      const response = await FavoriteService.deleteFavorite(router.query.id);
      if (response?.status === 200) {
        setIsFavorite(false);
        setFavorites(
          favorites.filter(
            (favorite) => favorite.receptor._id !== router.query.id
          )
        );
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex py-4 w-80 rounded-lg my-2 items-center">
      <div className="w-36 h-32 rounded-2xl mr-2">
        <div className="bg-lightBlue w-full h-full rounded-2xl relative">
          <Image
            src={avatar + "?hola=" + random() ?? "/assets/proovedor.png"}
            fill
            alt="nuevo"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <FavButton
            isFavorite={isFavorite}
            handleSetFav={handleSetFav}
            handleDeleteFav={handleDeleteFav}
          />
          <h1 className="font-semibold text-black">{name}</h1>
        </div>
        <p className="text-blackText my-2">
          {services?.map((service) => service.id.name).join(", ")}
        </p>
        <div className="flex items-center">
          <StarIcon color={"#00A0D5"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText">{`(50)`}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
