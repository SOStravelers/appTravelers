import { useRouter } from "next/router";
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

const services = [
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
  icons = services,
  viewMoreLink = "/collections", // antes era "#"
  onIconClick,
  onViewMoreClick,
}) {
  const router = useRouter();

  const handleIconClick = (iconData) => {
    if (onIconClick) {
      onIconClick(iconData);
    } else {
      console.log("Icon clicked:", iconData.label);
    }
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
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Explore nossas coleções
        </h2>
        <button
          type="button"
          onClick={handleViewMore}
          className="text-sm text-blue-600 hover:underline"
        >
          Ver tudo
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
        <div className="flex py-4 px-2 w-max mx-auto">
          {icons.map((iconData, index) => (
            <div
              key={iconData.id}
              onClick={() => handleIconClick(iconData)}
              className={`flex flex-col items-center justify-center flex-shrink-0 w-24 h-28 shadow-[0px_11px_20px_5px_#00000015] p-4 rounded-lg transition-colors duration-200 ease-in-out ${
                onIconClick
                  ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  : ""
              } ${index !== icons.length - 1 ? "mr-4" : ""}`}
            >
              <div className="text-gray-700 dark:text-gray-300 mb-2">
                {iconData.icon}
              </div>
              <span className="text-xs text-center text-gray-600 dark:text-gray-400">
                {iconData.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IconCarousel;
