import { useRef, useEffect } from "react";
import ServiceCardRecomendation from "@/components/utils/cards/ServiceCardRecomendation";

const RecomendationCarousel = (services = []) => {
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

  const servicesToDisplay =
    services && services.length > 0 ? services : defaultServices;
  console.log("services to display:", servicesToDisplay);

  const carouselRef = useRef(null);

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
