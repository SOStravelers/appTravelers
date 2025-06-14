const InclusionsExclusions = ({ inclusions = [], exclusions = [] }) => {
  return (
    <div className="inclusions-exclusions mt-8">
      {/* Qué incluye (What's Included) Section */}
      <div className="inclusions mb-6">
        <h3 className="text-lg font-semibold mb-4">Qué incluye</h3>
        <ul>
          {inclusions.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="mr-2 text-green-500">&#10004;</span> {/* Checkmark icon */}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* No apto para (Not Suitable For) Section */}
      <div className="exclusions">
        <h3 className="text-lg font-semibold mb-4">No apto para</h3>
        <ul>
          {exclusions.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <span className="mr-2 text-red-500">&#10006;</span> {/* Cross icon */}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InclusionsExclusions;