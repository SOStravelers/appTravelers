import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardFavorite from "@/components/utils/cards/WorkerCardFavorite";
import { BarberPicture } from "@/constants/icons";

export default function Favorites() {
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const user = Cookies.get("auth.user_id");

  useEffect(() => {
    if (user) {
      setFavorites([
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/1",
        },
        {
          name: "John Doe",
          service: "Barber",
          score: 5,
          link: "/1",
        },
      ]);
    } else {
      setOpen(true);
    }
  }, []);
  return (
    <div className="bg-white h-full w-screen flex flex-col items-center md:items-start py-20 px-3 md:pl-80">
      <p className="text-center text-greyText max-w-lg lg:my-4 xl:my-4">
        No favorites yet
      </p>
      <div className="max-w-lg text-xl my-3 flex justify-center">
        <BarberPicture />
      </div>
      {favorites.map((favorite, index) => (
        <WorkerCardFavorite
          key={index}
          name={favorite.name}
          service={favorite.service}
          score={favorite.score}
          link={favorite.link}
        />
      ))}
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
