import React from "react";
import { FaFlag } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

const PointsOfInterestList = ({ pointsOfInterest = [] }) => {
  return (
    <div className="points-of-interest-list mt-8">
      <h3 className="text-lg font-semibold mb-2">Puntos destacados</h3>
      <h4 className="text-md font-semibold mb-6">¿Qué veremos en este tour?</h4>

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
                <span className="text-white font-semibold">{index}</span>
              )}
            </div>

            {/* Contenido del punto */}
            <div className="flex flex-col">
              <p className="font-semibold text-gray-800">{point.name}</p>
              {point.location && (
                <p className="text-sm text-gray-600">{point.location}</p>
              )}
              {point.mapLink && (
                <button
                  onClick={() => window.open(point.mapLink, "_blank")}
                  className="inline-flex items-center text-blueBorder font-semibold text-md mt-1 hover:underline focus:outline-none"
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
