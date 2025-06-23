import React from "react";
import { FaFlag } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";
const PointsOfInterestList = ({ pointsOfInterest = [] }) => {
  const store = useStore();
  const { language } = store;
  return (
    <div className="points-of-interest-list mt-8">
      {pointsOfInterest.length > 0 && (
        <>
          <h3 className="text-md font-semibold mb-2">
            {languageData.pointInterest.title[language]}
          </h3>
          <h4 className="text-sm mb-6">
            {languageData.pointInterest.subtitle[language]}
          </h4>
        </>
      )}

      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-300"></div>

        {pointsOfInterest.map((point, index) => (
          <div key={index} className="relative mb-8 pl-12">
            {/* Icono o número */}
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

            {/* Contenido del punto */}
            <div className="flex flex-col">
              <p className=" text-gray-800 text-sm">{point.name[language]}</p>

              {point.mapLocation && index === 0 && (
                <button
                  onClick={() => window.open(point.mapLocation, "_blank")}
                  className="inline-flex items-center text-blueBorder font-semibold text-sm mt-1 hover:underline focus:outline-none"
                >
                  Ver en mapa
                  <MdArrowForward className="ml-1 w-6 h-6" />
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
