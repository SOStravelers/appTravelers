import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import WorkerCardFavorite from "@/components/utils/cards/WorkerCardFavorite";
import FavoriteService from "@/services/FavoriteService";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FavoritePicture } from "@/constants/icons";
import { Rings } from "react-loader-spinner";
import languageData from "@/language/favorites.json";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
export default function Favorites() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal, setService, language, loggedIn } = store;
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My favorites | SOS Travelers";
    setService({});
    if (loginModal) {
      setOpen(false);
      setLoginModal(false);
    }
    if (loggedIn) {
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

  const handleNavigate = (id) => {
    // Cookies.set("homeItemId", id);
    // setLastPage("preview");
    router.push(`/service-preview/${id}`, undefined, { scroll: false });
  };

  return (
    <div className="mx-auto px-4 md:pl-[240px] bg-gray-50 mb-20">
      <h1 className="my-3 font-semibold text-center max-w-lg">
        {languageData.title[language]}
      </h1>
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
        favorites.map((svc, i) => (
          <div key={svc._id} data-item-id={svc._id} className="w-full ">
            <ServiceCardRecomendation
              service={svc.subservice}
              index={i}
              onClick={() => handleNavigate(svc.subservice._id)}
            />
          </div>
        ))
      ) : (
        <div>
          <p className="text-center text-greyText max-w-lg  lg:my-4 xl:my-4 mb-2">
            {languageData.noFavorites[language]}
          </p>
          <div className="max-w-lg text-xl my-3 flex justify-center">
            <FavoritePicture />
          </div>
        </div>
      )}

      {!loggedIn && (
        <LoginFormModal
          open={open}
          setOpen={setOpen}
          title="Login to continue"
        />
      )}
    </div>
  );
}
