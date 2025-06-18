import { useRouter } from "next/router";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import languageData from "@/language/subServices.json";
import ServiceService from "@/services/ServiceService";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  GiPartyPopper,
  GiMeal,
  GiHiking,
  GiParachute,
  GiSoccerBall,
  GiCarWheel,
} from "react-icons/gi";
import { MdSurfing } from "react-icons/md";

import * as FaIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";

const Icons = {
  ...FaIcons,
  ...GiIcons,
  ...MdIcons,
};
import { TbCheese } from "react-icons/tb";
const allIcons = [
  { id: 1, icon: <FaMapMarkedAlt size={32} />, label: "Tour" },
  { id: 2, icon: <GiPartyPopper size={32} />, label: "Fiestas & Shows" },
  { id: 3, icon: <GiMeal size={32} />, label: "Gastronomía" },
  { id: 4, icon: <GiHiking size={32} />, label: "Senderos" },
  { id: 5, icon: <GiParachute size={32} />, label: "Experiencias" },
  { id: 6, icon: <MdSurfing size={32} />, label: "Surf al amanecer" },
  { id: 7, icon: <GiSoccerBall size={32} />, label: "Fútbol" },
  { id: 8, icon: <GiCarWheel size={32} />, label: "Transfers" },
  { id: 9, icon: <GiMeal size={32} />, label: "Extra 1" },
  { id: 10, icon: <GiHiking size={32} />, label: "Extra 2" },
];

function IconCarousel({
  icons = allIcons,
  viewMoreLink = "/collections", // antes era "#"
  onViewMoreClick,
}) {
  const router = useRouter();
  const store = useStore();
  const { services, setServices, setService, language } = store;

  // 1) Fetch y setear items + activeIndex a 0
  useEffect(() => {
    ServiceService.list({ isActive: true, page: 1 })
      .then((res) => {
        const data = res.data.docs;
        if (Array.isArray(data) && data.length > 0) {
          setServices(response.data.docs);
        }
      })
      .catch((err) => console.error("Fetch services:", err));
  }, []);

  const IconMapper = ({ name, ...props }) => {
    const IconComponent = Icons[name] || TbCheese;
    return <IconComponent {...props} />;
  };

  const handleIconClick = (data) => {
    setService({ serviceId: data._id, serviceName: data.name });
  };

  const handleViewMore = () => {
    if (onViewMoreClick) {
      onViewMoreClick();
    } else {
      router.push(viewMoreLink || "/collections");
    }
  };

  return (
    <div className="w-full mt-5">
      <div className="flex items-center justify-between mt-1 px-4">
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

      {/* Contenedor scrollable */}
      <div
        className="overflow-x-auto w-full px-4"
        style={{
          scrollbarColor: "#888 #f1f1f1",
          scrollbarWidth: "auto",
        }}
      >
        <div className="flex py-2 px-2 w-max mx-auto">
          {services.map((service, index) => (
            <div
              key={service._id}
              onClick={() => handleIconClick(service)}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-24 h-28 shadow-[0px_11px_20px_5px_#00000015] p-4 rounded-lg transition-colors duration-200 ease-in-out ${
                handleIconClick
                  ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-300"
                  : ""
              } ${index !== services.length - 1 ? "mr-4" : ""}`}
            >
              <IconMapper
                name={service.icon}
                size={32}
                className="text-gray-900 dark:text-gray-500 mb-2"
              />
              <span className="text-xs text-center text-gray-900 dark:text-gray-600">
                {service.name[language]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IconCarousel;
