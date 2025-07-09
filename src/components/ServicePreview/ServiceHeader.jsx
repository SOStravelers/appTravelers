import { useStore } from "@/store";
import languageData from "@/language/subServices.json";
const ServiceHeader = ({ service, serviceType }) => {
  const store = useStore();
  const { language } = store;
  if (!service) {
    return null;
  }

  const { rate, rateCount } = service;
  const name = typeof service.name === "object" ? service.name[language] : "";

  return (
    <div className="service-header">
      {serviceType && (
        <span className="text-xxs font-semibold text-gray-600 bg-gray-200 px-1 py-1 rounded">
          {serviceType[language]}
        </span>
      )}

      <h1 className="text-xl font-bold mt-1">{name}</h1>
      {/* Rating and Review Count */}
      <div className="flex items-center text-sm text-gray-600 mt-1">
        {rate && (
          <>
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm">{rate} </span>
          </>
        )}
        {rateCount && <span className="ml-2">({rateCount})</span>}
        {/* You might want to add "Aceptable" or similar text based on score */}
        {rate && rate >= 4 && (
          <span className="ml-2 text-green-500 text-sm font-semibold">
            {languageData.serviceInfo.highRate[language]}
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceHeader;
