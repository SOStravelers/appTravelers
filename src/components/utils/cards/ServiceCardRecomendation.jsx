// ServiceCardRecomendation.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import languageData from "@/language/subServices.json";
import { useStore } from "@/store";
import { formatTime } from "@/lib/time";

const ServiceCardRecomendation = ({
  service,
  onClick,
  index,
  onlikeButton,
}) => {
  const store = useStore();
  const router = useRouter();
  const { language } = store;
  const {
    gallery,
    name,
    rate,
    rateCount,
    duration,
    price,
    isFavorite,
    isPopular,
  } = service || {};

  const [isFavorited, setIsFavorited] = useState(isFavorite || false);

  if (!service) return null;

  // Preparamos un array de 4 celdas: con URL o null
  const images = gallery?.images || [];
  const gridItems = [0, 1, 2, 3].map((i) => images[i] || null);

  const favoriteAction = (state) => {
    console.log("entramos");
    const shouldToggle = onlikeButton(state, service._id);
    if (shouldToggle) {
      setIsFavorited(state);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg  w-full relative cursor-pointer"
    >
      {/* Badge “Popular” */}
      <span className="absolute top-2 left-2 z-10 bg-white text-xs font-semibold px-2 py-1 rounded-full shadow">
        Popular
      </span>

      {/* Corazón de favorito */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          favoriteAction((prev) => !prev);
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
      <div className="w-full h-[350px] grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-xl">
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
            <div key={idx} className="w-full h-full bg-gray-100" />
          )
        )}
      </div>

      {/* Contenido */}
      <div className="p-2">
        {/* Precio */}

        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-800">
            {languageData.card.textPrice1[language]} R${price.category1}{" "}
          </span>

          <div className="flex items-center mb-2">
            <svg
              className="h-4 w-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 1l2.8 6.3 6.2.9-4.5 4.3 1.1 6-5.6-3.2L4.4 18.5l1.1-6-4.5-4.3 6.2-.9L10 1z" />
            </svg>
            <span className="text-sm text-gray-600 ml-1">
              {rate} ({rateCount})
            </span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {name[language]}
        </h3>

        {/* Rating */}

        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ServiceCardRecomendation;
