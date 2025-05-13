import { useRef, useEffect } from 'react';
import ServiceCardRecomendation from '@/components/utils/cards/ServiceCardRecomendation';

const RecomendationCarousel = (services = []) => {
  


  const servicesToDisplay = services?.length > 0 ? services : [];
  console.log('services to display:', servicesToDisplay)

  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [servicesToDisplay]);


  return (
    <div className="w-full">
      <div className="flex justify-start items-center mb-4">
        <h2 className="text-xl font-semibold">Recomendado para ti</h2>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 p-2 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* {services.map((service) => (
          <ServiceCardRecomendation key={service.id} service={service} isFavorite={service.isFavorite} />))} */}
        {
          servicesToDisplay.map((service, index) =>
            <ServiceCardRecomendation key={service.id} service={service} index={index} />
          )}
      </div>
    </div>
  );
};

export default RecomendationCarousel;