// Import icons from react-icons
import {
  GiHiking,
  GiPartyPopper,
  GiMeal,
  GiParachute,
  GiSoccerBall,
  GiCarWheel,
} from "react-icons/gi";
import { FaMapMarkedAlt } from "react-icons/fa"; // Example icon from react-icons/fa
import { MdSurfing } from "react-icons/md";
import LanguageData from "@/language/home.json";

const Collections = () => {
  const services = [
    { name: "Tour", icon: <FaMapMarkedAlt size={48} /> }, // Using FaMapMarkedAlt for Tour
    { name: "Fiestas & Shows", icon: <GiPartyPopper size={48} /> }, // Using GiPartyPopper for Fiestas & Shows
    { name: "Gastronomia", icon: <GiMeal size={48} /> }, // Using GiMeal for Gastronomia
    { name: "Senderos", icon: <GiHiking size={48} /> }, // Using GiHiking for Senderos
    { name: "Experiencias", icon: <GiParachute size={48} /> }, // Using GiParachute for Experiencias
    { name: "surf al amanecer etc)", icon: <MdSurfing size={48} /> }, // Using RiEBikeFill for surf (as an example for outdoor activity)
    { name: "Partidos de futbol", icon: <GiSoccerBall size={48} /> }, // Using GiSoccerBall for Partidos de futbol
    { name: "Transfers", icon: <GiCarWheel size={48} /> }, // Using GiCar for Transfers
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 pb-[100px] p-4 pt-20 md:pt-32 ">
      <h1 className="text-2xl font-bold mb-6 text-center w-full">Coleções</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center items-center">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2 rounded-2xl w-28 h-28 shadow-[0px_11px_20px_5px_#00000015]"
          >
            <div className="w-16 h-16 relative flex justify-center items-center text-gray-900 dark:text-gray-500">
              {service.icon}
            </div>
            <span className="mt-3 text-xs font-medium text-center text-gray-900 dark:text-gray-600">
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
