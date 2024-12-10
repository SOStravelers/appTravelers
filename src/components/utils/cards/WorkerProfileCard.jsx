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
import Link from "next/link";

function WorkerProfileCard({ name, services, score, avatar }) {
  const [favorites, setFavorites] = useState([]);
  const { user, language } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [fromFavorite, setFromFavorite] = useState(false);

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

  useEffect(() => {
    if (localStorage.getItem("fromFavorite")) {
      setFromFavorite(true);
    }
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
      <div className="w-24 h-24  sm:w-32 sm:h32 lg:w-32 lg:h-32 xl:w-32 xl:h-32 rounded-2xl mr-2">
        <div className=" w-full h-full rounded-2xl relative">
          <Image
            src={avatar ? avatar + "?hola=" + random() : "/assets/user.png"}
            fill
            alt="profileImg"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="flex flex-col  ">
        <div className="flex items-center justify-">
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
        <p className="text-blackText my-1    text-xs   sm:text-sm ">
          {services
            ?.map((service) => capitalize(service.id.name[language]))
            .join(", ")}
        </p>
        <div className=" flex items-center w-30">
          <StarIcon color={"#00A0D5"} className="mr-1" />
          <p className="text-blackText">{score}</p>
          <p className="text-blackText mr-2">{` (+50)`}</p>

          {fromFavorite && (
            <Link href={"/services/" + router.query.id}>
              <SmallButton text={"Book now!"} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkerProfileCard;
