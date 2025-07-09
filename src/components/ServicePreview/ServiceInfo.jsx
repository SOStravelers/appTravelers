import languageData from "@/language/subServices.json";
import { useStore } from "@/store";
import { formatTime } from "@/lib/time";
const ServiceInfo = ({ service }) => {
  const store = useStore();
  const { language } = store;
  if (!service) {
    return null; // Or some loading/error state
  }

  return (
    <div className="mt-4">
      <div className="flex items-center text-textColor text-xs mb-2">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
        <span>Rio de Janeiro</span>
      </div>

      <div className="flex items-center text-textColor text-xs mb-2">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-18C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm-.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
        <span>
          {languageData.serviceInfo.duration[language]}:
          {formatTime(service.duration)}
        </span>
      </div>
      <div className="flex items-center text-textColor text-xs">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7-7h-4V3h-2v2H8V3H6v2H2v15h17v-3h3v-8c0-2.21-1.79-4-4-4zM4 7h15v3h-4c-1.1 0-2 .9-2 2s.9 2 2 2h4v3H4V7z" />
        </svg>
        <span>
          {languageData.serviceInfo.languageTitle[language]}:{" "}
          {languageData.serviceInfo.languages[language]}
        </span>
      </div>
      {/* {service.commentsCount > 2 && (
        <a
          href={service.commentsCount}
          className="text-blue-600 text-sm mt-2 inline-block"
        >
          Leer reseñas
        </a>
      )} */}
    </div>
  );
};

export default ServiceInfo;
