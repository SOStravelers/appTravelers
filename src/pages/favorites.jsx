import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardFavorite from "@/components/utils/cards/WorkerCardFavorite";
import FavoriteService from "@/services/FavoriteService";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FavoritePicture } from "@/constants/icons";

export default function Favorites() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  var user = Cookies.get("auth.user_id");

  useEffect(() => {
    document.title = "My favorites - SOS Travelers";
    if (loginModal) {
      setOpen(false);
      setLoginModal(false);
    }
    if (user) {
      getFavorites();
    } else {
      setOpen(true);
    }
  }, [loginModal]);

  const getFavorites = async () => {
    try {
      const response = await FavoriteService.listFavorites();
      console.log(response);
      if (response?.data?.length > 0) {
        setFavorites(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFav = async (id) => {
    try {
      const response = await FavoriteService.deleteFavorite(id);
      console.log(response);
      if (response?.status === 200) {
        setFavorites(
          favorites.filter((favorite) => favorite.receptor._id !== id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-20 px-3 md:pl-80">
      {favorites?.length > 0 ? (
        favorites.map((favorite) => (
          <WorkerCardFavorite
            key={favorite._id}
            id={favorite.receptor._id}
            name={
              favorite.receptor.personalData.name.first +
              " " +
              favorite.receptor.personalData.name.last
            }
            image={favorite.receptor.img.imgUrl || "/assets/user.png"}
            services={favorite?.receptor?.workerData?.services}
            score={5}
            link={`/worker/${favorite.receptor._id}`}
            handleDeleteFav={() => {
              handleDeleteFav(favorite.receptor._id);
            }}
          />
        ))
      ) : (
        <div>
          <p className="text-center text-greyText max-w-lg  lg:my-4 xl:my-4 mb-2">
            No favorites yet
          </p>
          <div className="max-w-lg text-xl my-3 flex justify-center">
            <FavoritePicture />
          </div>
        </div>
      )}
      {!user && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
