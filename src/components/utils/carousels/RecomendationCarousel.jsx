import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
import SubserviceService from "@/services/SubserviceService";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";

const RecomendationCarousel = () => {
  const store = useStore();
  const router = useRouter();
  const { language } = store;
  const carouselRef = useRef(null);
  const [servicesToDisplay, setServicesToDisplay] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("req", router.query.id);
        const response = await SubserviceService.getRecommended(
          router.query.id
        );
        const data = response.data;
        if (data && Array.isArray(data)) {
          setServicesToDisplay(data);
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
        <h2 className="text-xl font-semibold text-textColor">
          {languageData.index.recommended[language]}
        </h2>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 p-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
      >
        {servicesToDisplay.map((service, index) => (
          <div
            key={service._id}
            className="min-w-[280px] max-w-[320px] snap-start"
          >
            <ServiceCardRecomendation
              onClick={() => router.push(`/service-preview/${service._id}`)}
              service={service}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecomendationCarousel;
