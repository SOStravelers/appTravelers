import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import FavButton from "@/components/utils/buttons/FavButton";
import { StarIcon } from "@/constants/icons";
import { toast } from "react-toastify";
import { random } from "@/lib/utils";
import FavoriteService from "@/services/FavoriteService";
import { useStore } from "@/store";
import SmallButton from "../buttons/SmallButton";

function WorkerProfileCard({ name, services, score, avatar }) {
  const [favorites, setFavorites] = useState([]);
  const { user } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const capitalize = (cadena) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
  };

  useEffect(() => {
    console.log("el user", user);
    if (user && Object.keys(user).length > 0) {
      getFavorites();
    }
  }, [user]);

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
      toast.error("An error has occurred.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    }
  };

  const handleSetFav = async () => {
    try {
      const response = await FavoriteService.addFavorite(router.query.id);
      if (response?.data?.emisor) {
        setIsFavorite(true);
        setFavorites([...favorites, response?.data]);
        toast.info("Added to favorites", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1200,
        });
      }
    } catch (error) {
      toast.error("An error has occurred.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
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
        toast.info("Removed from favorites", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1200,
        });
      }
    } catch (error) {
      toast.error("An error has occurred.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1200,
      });
    }
  };
  return (
    <div className="flex py-4 w-100 rounded-lg my-2 items-center">
      <div className="w-28 h-28 rounded-2xl mr-2">
        <div className=" w-full h-full rounded-2xl relative">
          <Image
            src={avatar ? avatar + "?hola=" + random() : "/assets/user.png"}
            fill
            alt="profileImg"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <h1 className="font-semibold text-black">{name}</h1>

          {user && Object.keys(user).length > 0 ? (
            <div className="ml-4">
              <FavButton
                isFavorite={isFavorite}
                handleSetFav={handleSetFav}
                handleDeleteFav={handleDeleteFav}
              />
            </div>
          ) : null}
        </div>
        <p className="text-blackText my-2">
          {services?.map((service) => capitalize(service.id.name)).join(", ")}
        </p>
        <div className="flex items-center">
          <StarIcon color={"#00A0D5"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText">{`(50)`}</p>
          <SmallButton py="py-0" w="w-35" px="px-1" text={"Book now!"} />
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
