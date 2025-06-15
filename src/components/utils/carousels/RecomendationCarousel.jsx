import { useRef, useEffect, useState } from "react";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
import SubserviceService from "@/services/SubserviceService";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";
const RecomendationCarousel = (services = []) => {
  const store = useStore();
  const { language } = store;
  const carouselRef = useRef(null);
  const [servicesToDisplay, setServicesToDisplay] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await SubserviceService.getRecommended();
        const data = response.data;
        console.log("llega bien la data", data);
        if (data && Array.isArray(data)) {
          setServicesToDisplay(data);

          console.log("llega la data", servicesToDisplay);
        } else {
          console.warn("La respuesta no es un array:", data);
        }
      } catch (error) {
        console.error("Error al obtener subservicios con videos:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [servicesToDisplay]);

  return (
    <div className="w-full py-2">
      <div className="flex justify-start items-center">
        <h2 className="text-xl font-semibold">
          {languageData.index.recommended[language]}
        </h2>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 p-2 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {servicesToDisplay.map((service, index) => (
          <ServiceCardRecomendation
            key={service._id}
            service={service}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default RecomendationCarousel;
