const ServiceHeader = ({ service, serviceType }) => {
  if (!service) {
    return null;
  }

  const { title, score, scoreCount } = service;
  return (
    <div className="service-header mb-4">
      {serviceType && (
        <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">{serviceType}</span>
      )}

      <h1 className="text-2xl font-bold mt-2">{title}</h1>
      {/* Rating and Review Count */}
      <div className="flex items-center text-sm text-gray-600 mt-1">
        {score && (
          <>
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{score}</span>
          </>
        )}
        {scoreCount && (
          <span className="ml-2">({scoreCount})</span>
        )}
        {/* You might want to add "Aceptable" or similar text based on score */}
        {score && score >= 4 && <span className="ml-2">Aceptable</span>}
      </div>
    </div>
  );
};

export default ServiceHeader;