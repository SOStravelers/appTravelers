// ServiceCardRecomendation.jsx
import { useEffect, useState } from "react";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import languageData from "@/language/subServices.json";
import { useStore } from "@/store";
import { formatTime } from "@/lib/time";
import { useRouter } from "next/router";
import FavoriteService from "@/services/FavoriteService";
import { formatPrice } from "@/utils/format";
import FloatingFavoriteToast from "@/components/utils/modal/FloatingFavoriteToast";
const ServiceCardRecomendation = ({ service, onClick, openLoginModal }) => {
  const store = useStore();
  const router = useRouter();
  const { language, currency, loggedIn } = store;
  const {
    gallery,
    name,
    rate,
    rateCount,
    duration,
    isFavorite,
    isPopular,
    refPrice,
    tourData,
    typeService,
    chipData,
  } = service || {};
  const [showToast, setShowToast] = useState(false);
  const [stateTextFavorite, setStateTextFavorite] = useState("");
  const [isFavorited, setIsFavorited] = useState(isFavorite || false);
  const [price, setPrice] = useState({
    eur: "- €",
    usd: "- USD",
    brl: "R$ -",
  });

  if (!service) return null;

  // Preparamos un array de 4 celdas: con URL o null
  const images = gallery?.images || [];
  const gridItems = [0, 1, 2, 3].map((i) => images[i] || null);

  useEffect(() => {
    console.log("wena", refPrice, "chao", service.refPrice, "pelao", service);
    refPrice ? setPrice(refPrice) : null;
  }, [currency]);

  const handleLike = async () => {
    console.log("va el like");
    if (!loggedIn) {
      console.log("no user");
      openLoginModal();
      return;
    }
    try {
      setIsFavorited((prev) => !prev);
      !isFavorited
        ? openPopupFavorite(true, "added")
        : openPopupFavorite(true, "removed");
      !isFavorited
        ? await FavoriteService.addFavorite(service._id)
        : await FavoriteService.removeFavorite(service._id);
    } catch (err) {
      console.log(err);
    }
  };

  const openPopupFavorite = (state, text) => {
    setShowToast(true);
    setStateTextFavorite(text);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-backgroundP rounded-lg  w-full relative cursor-pointer"
      >
        {/* Badge “Popular” */}
        <span className="absolute top-2 left-2 z-10 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow">
          {chipData ? chipData[language] : "Popular"}
        </span>

        {/* Corazón de favorito */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="absolute top-2 right-2 z-10 p-1"
        >
          {isFavorited ? (
            <MdFavorite size={25} color="tomato" />
          ) : (
            <MdFavoriteBorder size={25} />
          )}
        </button>

        {/* Collage de imágenes 2x2 */}
        <div
          className="w-full aspect-square md:aspect-[9/10]   /* 4 × 3 en md+ */
            grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl"
        >
          {gridItems.map((imgUrl, idx) =>
            imgUrl ? (
              <img
                key={idx}
                src={imgUrl}
                alt={name[language] || "Service image"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                key={idx}
                className="w-full h-full bg-backgroundCardSecondary"
              />
            )
          )}
        </div>
        {/* Contenido */}
        <div className="p-2">
          {/* Precio */}

          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-textColor">
              {languageData.card.textPrice1[language]}{" "}
              {formatPrice(price[currency], currency)}
            </span>

            <div className="flex items-center">
              <svg
                className="h-4 w-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 1l2.8 6.3 6.2.9-4.5 4.3 1.1 6-5.6-3.2L4.4 18.5l1.1-6-4.5-4.3 6.2-.9L10 1z" />
              </svg>
              <span className="text-sm text-textColor ml-1">
                {rate} ({rateCount})
              </span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-sm sm:text-xs font-semibold text-textColor ">
            {name[language]}
          </h3>

          {/* Rating */}

          <span className="text-xs text-textColor">{formatTime(duration)}</span>
        </div>
      </div>
      <FloatingFavoriteToast
        visible={showToast}
        onClose={() => setShowToast(false)}
        imgUrl={service?.imgUrl}
        state={stateTextFavorite}
      />
    </>
  );
};

export default ServiceCardRecomendation;
