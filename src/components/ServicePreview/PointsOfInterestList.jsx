const PointsOfInterestList = ({ pointsOfInterest = [] }) => {
  return (
    <div className="points-of-interest-list mt-8">
      <h3 className="text-lg font-semibold mb-4">Puntos destacados</h3>
      <h4 className="text-md font-semibold mb-4">¿Qué veremos en este tour?</h4>
      <div className="relative">
        {pointsOfInterest.map((point, index) => (
          <div key={index} className="flex items-start mb-6">
            <div className="flex flex-col items-center mr-4">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              {index < pointsOfInterest.length - 1 && (
                <div className="w-px bg-gray-300 flex-grow mt-1"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{point.name}</p>
              <p className="text-sm text-gray-600">{point.location}</p>
              {point.mapLink && (
                <button className="text-blue-600 text-sm mt-1">
                  Ver en mapa
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