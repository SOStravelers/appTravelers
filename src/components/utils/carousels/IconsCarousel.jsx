import { useRouter } from "next/router";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
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

export default function IconCarousel({
  viewMoreLink = "/collections",
  onViewMoreClick,
}) {
  const router = useRouter();
  const store = useStore();
  const { services, setServices, setService, language } = store;
  const [activeIdx, setActiveIdx] = useState(0);

  // Fetch services once
  useEffect(() => {
    ServiceService.list({ isActive: true, page: 1 })
      .then((res) => setServices(res.data.docs))
      .catch((err) => console.error("Fetch services:", err));
  }, []);

  const handleIconClick = (service, idx) => {
    setService({ serviceId: service._id, serviceName: service.name });
    setActiveIdx(idx);
  };

  const handleViewMore = () => {
    if (onViewMoreClick) onViewMoreClick();
    else router.push(viewMoreLink);
  };

  const IconMapper = ({ name, ...props }) => {
    const IconComponent = Icons[name] || TbCheese;
    return <IconComponent {...props} />;
  };

  return (
    <nav className="w-full">
      {/* Header with title and "see all" */}
      <div className="flex items-center justify-between px-4 py-2">
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

      {/* Scrollable list */}
      <div className="overflow-x-auto">
        <ul className="flex space-x-6 px-4">
          {services.map((service, idx) => (
            <li key={service._id}>
              <button
                onClick={() => handleIconClick(service, idx)}
                className="flex flex-col items-center text-center focus:outline-none"
              >
                <IconMapper
                  name={service.icon}
                  size={24}
                  className={
                    idx === activeIdx ? "text-gray-900" : "text-gray-500"
                  }
                />
                <span
                  className={`mt-1 text-sm ${
                    idx === activeIdx
                      ? "text-gray-900 border-b-2 border-blueBorder pb-1 my-1"
                      : "text-gray-500"
                  }`}
                >
                  {service.name[language]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
