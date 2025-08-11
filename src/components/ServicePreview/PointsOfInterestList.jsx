import React from "react";
import { FaFlag } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";

const PointsOfInterestList = ({ pointsOfInterest = [] }) => {
  const { language } = useStore();

  const isMobileDevice = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|android/.test(ua);
  };

  const extractCoordinates = (geoUrl) => {
    const match = geoUrl.match(/geo:([-.\d]+),([-.\d]+)/);
    if (match) {
      return { lat: match[1], lng: match[2] };
    }
    return null;
  };

  return (
    <div className="points-of-interest-list mt-8">
      {pointsOfInterest.length > 0 && (
        <>
          <h3 className="text-md text-textColor font-semibold mb-2">
            {languageData.pointInterest.title[language]}
          </h3>
          <h4 className="text-sm text-textColor mb-6">
            {languageData.pointInterest.subtitle[language]}
          </h4>
        </>
      )}

      <div className="relative">
        <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-300"></div>

        {pointsOfInterest.map((point, index) => (
          <div key={index} className="relative mb-8 pl-12">
            <div
              className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: index === 0 ? "#00A0D5" : "#6b7280" }}
            >
              {index === 0 ? (
                <FaFlag className="text-white w-4 h-4" />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {index}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-textColorGray text-sm">
                {point.name?.[language]}
              </p>

              {point.mapLocation && (
                <button
                  onClick={() => {
                    if (isMobileDevice()) {
                      // abrir geo directamente
                      window.location.href = point.mapLocation;
                    } else {
                      // extraer lat/lng y abrir en Google Maps web
                      const coords = extractCoordinates(point.mapLocation);
                      if (coords) {
                        const url = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
                        window.open(url, "_blank");
                      }
                    }
                  }}
                  className="inline-flex items-center text-blueBorder font-semibold text-sm mt-1 hover:underline focus:outline-none"
                >
                  {languageData.pointInterest.seeMap?.[language] ||
                    "Ver en mapa"}
                  <MdArrowForward className="ml-1 w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsOfInterestList;
