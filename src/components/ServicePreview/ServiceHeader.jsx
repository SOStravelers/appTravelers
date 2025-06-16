import { useStore } from "@/store";
const ServiceHeader = ({ service, serviceType }) => {
  const store = useStore();
  const { language } = store;
  if (!service) {
    return null;
  }

  const { rate, rateCount } = service;
  const name = typeof service.name === "object" ? service.name[language] : "";

  return (
    <div className="service-header mb-4">
      {serviceType && (
        <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 pb-1 rounded">
          {serviceType[language]}
        </span>
      )}

      <h1 className="text-2xl font-bold mt-2">{name}</h1>
      {/* Rating and Review Count */}
      <div className="flex items-center text-sm text-gray-600 mt-1">
        {rate && (
          <>
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{rate}</span>
          </>
        )}
        {rateCount && <span className="ml-2">({rateCount})</span>}
        {/* You might want to add "Aceptable" or similar text based on score */}
        {rate && rate >= 4 && <span className="ml-2">Aceptable</span>}
      </div>
    </div>
  );
};

export default ServiceHeader;
