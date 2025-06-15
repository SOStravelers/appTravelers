import { useRef, useEffect, useState } from "react";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";
import SubserviceService from "@/services/SubserviceService";
import { useStore } from "@/store";
const RecomendationCarousel = (services = []) => {
  const store = useStore();
  const { language } = store;
  const carouselRef = useRef(null);
  const [servicesToDisplay, setServicesToDisplay] = useState([]);
  const defaultServices = [
    {
      id: 1,
      name: "Prepare your own vinegar with an expert",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
      score: 4.83,
      scoreCount: 24,
      duration: "2 hours",
      price: 69,
    },
    {
      id: 2,
      name: "Live a local match at Vasco da Gama",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
      score: 4.83,
      scoreCount: 24,
      duration: "3,5 hours",
      price: 88,
    },
    {
      id: 3,
      name: "Join a conservation mission",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
      score: 4.8,
      scoreCount: 30,
      duration: "1 hour",
      price: 75,
    },
  ];
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await SubserviceService.getRecommended();
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
        <h2 className="text-xl font-semibold">Recomendado para ti</h2>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 p-2 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {servicesToDisplay.map((service, index) => (
          <ServiceCardRecomendation
            key={service.id}
            service={service}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default RecomendationCarousel;
