import { useRouter } from "next/router";
import { useStore } from "@/store";
import { useEffect } from "react";
import languageData from "@/language/subServices.json";
import ServiceService from "@/services/ServiceService";
import { TbCheese } from "react-icons/tb";
import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";

const Icons = {
  ...FaIcons,
  ...GiIcons,
  ...MdIcons,
};

function IconCarousel({ viewMoreLink = "/collections", onViewMoreClick }) {
  const router = useRouter();
  const store = useStore();
  const { services, setServices, setService, language } = store;

  useEffect(() => {
    ServiceService.list({ isActive: true, page: 1 })
      .then((res) => {
        setServices(res.data.docs);
      })
      .catch((err) => console.error("Fetch services:", err));
  }, []);

  const IconMapper = ({ name, ...props }) => {
    const IconComponent = Icons[name] || TbCheese;
    return <IconComponent {...props} />;
  };

  const handleIconClick = (service) => {
    setService({ serviceId: service._id, serviceName: service.name });
  };

  const handleViewMore = () => {
    if (onViewMoreClick) onViewMoreClick();
    else router.push(viewMoreLink);
  };

  return (
    <div className="w-full ">
      {/* Header */}
      <div className="flex items-center justify-between my-2 px-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {languageData.index.explore[language]}
        </h2>
        <button
          type="button"
          onClick={handleViewMore}
          className="text-sm font-semibold text-blueBorder hover:underline"
        >
          {languageData.index.seeAllButton[language]}
        </button>
      </div>

      {/* Scroll + fades */}
      <div className="relative w-full px-4 ">
        {/* Zona scrollable de iconos */}
        <div
          className="overflow-x-auto"
          style={{ scrollbarColor: "#888 #f1f1f1", scrollbarWidth: "auto" }}
        >
          <div className="flex pb-6 px-6 w-max mx-auto">
            {services.map((service, index) => (
              <div
                key={service._id}
                onClick={() => handleIconClick(service)}
                className={`
                  flex flex-col items-center justify-center 
                  flex-shrink-0 w-24 h-20 
                  shadow-[0px_11px_20px_5px_rgba(0,0,0,0.15)] 
                  p-2 rounded-lg 
                  cursor-pointer hover:bg-gray-300 
                  transition-colors duration-200 
                  ${index !== services.length - 1 ? "mr-4" : ""}
                `}
              >
                <IconMapper
                  name={service.icon}
                  size={24}
                  className="text-gray-900 mb-2"
                />
                <span className="text-xs text-center text-gray-900">
                  {service.name[language]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gradientes sólo sobre la altura del scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-4 w-12 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-4 w-12 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}

export default IconCarousel;
