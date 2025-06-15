import { useState } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import languageData from "@/language/subServices.json";
import { useStore } from "@/store";

const ServiceCardRecomendation = ({ service }) => {
  const store = useStore();
  const { language } = store;
  const { imgUrl, name, rate, numberComments, duration, price, isFavorite } =
    service;
  const [isFavorited, setIsFavorited] = useState(isFavorite || false);
  if (!service) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-md w-[250px] min-w-[250px] relative">
      <div className="w-full h-[220px] overflow-hidden rounded-t-lg">
        <img
          className="h-full w-full object-cover"
          src={imgUrl}
          alt="Service"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <h3 className="text-base font-semibold text-gray-800">
            {name[language]}
          </h3>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 1l2.8 6.3 6.2.9-4.5 4.3 1.1 6-5.6-3.2L4.4 18.5l1.1-6-4.5-4.3 6.2-.9L10 1z" />
            </svg>
          </div>
          <span className="text-sm text-gray-600 ml-1">
            {rate} ({numberComments})
          </span>
        </div>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={`absolute top-2 right-2 p-1 z-10`}
        >
          {isFavorited ? (
            <MdFavorite size={25} color="tomato" />
          ) : (
            <MdFavoriteBorder size={25} />
          )}
        </button>
        <div className="flex justify-between items-start flex-col mt-2">
          <span className="text-sm text-gray-600">
            {" "}
            {duration > 120
              ? `${(duration / 60).toFixed(1)} hr${duration >= 180 ? "s" : ""}`
              : `${duration} min`}{" "}
          </span>
          <span className="text-sm font-medium text-gray-800">
            {languageData.card.textPrice1[language]} R${price.category1}{" "}
            {languageData.card.textPrice2[language]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardRecomendation;
