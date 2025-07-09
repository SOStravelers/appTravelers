import React from "react";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";
const InclusionsExclusions = ({ inclusions = [], exclusions = [] }) => {
  const store = useStore();
  const { language } = store;
  return (
    <div className="inclusions-exclusions mt-8">
      {/* Qué incluye */}
      {exclusions.length > 0 && (
        <div className="inclusions mb-6">
          <h3 className="text-md text-textColor font-semibold mb-4">
            {languageData.inclusionsList.inclusions.title[language]}
          </h3>
          <ul>
            {inclusions.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                {/* Check verde */}
                <span className="mr-2 text-green-600 text-md flex-shrink-0">
                  ✓
                </span>
                <span className="text-textColor text-sm">
                  {item.name[language]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No apto para */}
      {exclusions.length > 0 && (
        <div className="exclusions">
          <h3 className="text-md  text-textColor font-semibold mb-4">
            {languageData.inclusionsList.exclusions.title[language]}
          </h3>
          <ul>
            {exclusions.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                {/* Cross roja */}
                <span className="mr-2 text-red-500 text-md flex-shrink-0">
                  ✕
                </span>
                <span className="text-textColor text-sm">
                  {item.name[language]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InclusionsExclusions;
