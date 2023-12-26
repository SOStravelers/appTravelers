import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardFavorite from "@/components/utils/cards/WorkerCardFavorite";
import FavoriteService from "@/services/FavoriteService";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FavoritePicture } from "@/constants/icons";
import { Rings } from "react-loader-spinner";
export default function Favorites() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal } = store;
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
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
      localStorage.removeItem("service");
      const response = await FavoriteService.listFavorites();
      // console.log(response);
      if (response?.data?.length > 0) {
        setFavorites(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteFav = async (id) => {
    try {
      const response = await FavoriteService.deleteFavorite(id);
      // console.log(response);
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
    <div className="p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">My favorites</h1>
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : favorites?.length > 0 ? (
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
