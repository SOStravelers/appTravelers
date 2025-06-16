import React from "react";

/**
 * InclusionsExclusions
 * Props:
 * - inclusions: Array<{ text: string }>
 * - exclusions: Array<{ text: string }>
 */
const InclusionsExclusions = ({ inclusions = [], exclusions = [] }) => {
  return (
    <div className="inclusions-exclusions mt-8">
      {/* Qué incluye */}
      <div className="inclusions mb-6">
        <h3 className="text-lg font-semibold mb-4">Qué incluye</h3>
        <ul>
          {inclusions.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              {/* Check verde */}
              <span className="mr-2 text-green text-xl flex-shrink-0">✓</span>
              <span className="text-gray-900">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* No apto para */}
      <div className="exclusions">
        <h3 className="text-lg font-semibold mb-4">No apto para</h3>
        <ul>
          {exclusions.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              {/* Cross roja */}
              <span className="mr-2 text-red text-xl flex-shrink-0">✕</span>
              <span className="text-gray-900">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InclusionsExclusions;
