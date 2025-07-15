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
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
export default function Favorites() {
  const store = useStore();
  const router = useRouter();
  const { loginModal, setLoginModal, setService, language, loggedIn } = store;
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true); // <-- loading flag
  useEffect(() => {
    setLoading(true);
    return delay(() => setLoading(false));
  }, []);

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
    setLoadingData(false);
  };

  const handleNavigate = (id) => {
    // Cookies.set("homeItemId", id);
    // setLastPage("preview");
    router.push(`/service-preview/${id}`, undefined, { scroll: false });
  };

  return (
    <div
      className={`px-6 flex flex-col items-center
        ${loading ? opacityAnimation : displayAnimation}
      `}
    >
      <h1 className="my-3 font-semibold text-center text-textColor max-w-lg">
        {languageData.title[language]}
      </h1>
      {loadingData ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2 text-textColor">Searching...</p>
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
          <p className="text-center text-textColorGray max-w-lg  lg:my-4 xl:my-4 mb-2">
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
