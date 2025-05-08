import React, { useState, useEffect } from 'react';
import ServiceCardRecomendation from '@/components/utils/cards/ServiceCardRecomendation';
import SolidButton from '@/components/utils/buttons/SolidButton';

const ITEMS_PER_LOAD = 4;

const ServiceList = ({ services: initialServices = [] }) => {
  const exampleServices = [
    {
      id: 1,
      name: "Prepare your own vinegar with an expert",
      imageUrl: "https://via.placeholder.com/300x220?text=Service+1",
      score: 4.83,
      scoreCount: 24,
      duration: "2 hours",
      price: 69,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Live a local match at Vasco da Gama",
      imageUrl: "https://via.placeholder.com/300x220?text=Service+2",
      score: 4.83,
      scoreCount: 24,
      duration: "3,5 hours",
      price: 88,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Join a conservation mission",
      imageUrl: "https://via.placeholder.com/300x220?text=Service+3",
      score: 4.8,
      scoreCount: 30,
      duration: "1 hour",
      price: 75,
      isFavorite: false,
    },
  ];
  const [displayedServices, setDisplayedServices] = useState(initialServices.length > 0 ? [] : exampleServices);
  const [nextItemIndex, setNextItemIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setDisplayedServices(initialServices.slice(0, ITEMS_PER_LOAD));
      setNextItemIndex(ITEMS_PER_LOAD);
      setHasMore(initialServices.length > ITEMS_PER_LOAD)
    } else if (exampleServices.length > 0) {
      setDisplayedServices(exampleServices.slice(0, ITEMS_PER_LOAD));
        setNextItemIndex(ITEMS_PER_LOAD);
        setHasMore(exampleServices.length > ITEMS_PER_LOAD)
    } else{
        setHasMore(false)
    }
  }, [initialServices]);

  const handleLoadMore = () => {
    const nextServices = initialServices.slice(nextItemIndex, nextItemIndex + ITEMS_PER_LOAD);
    setDisplayedServices([...displayedServices, ...nextServices]);
    setNextItemIndex(nextItemIndex + ITEMS_PER_LOAD);
    setHasMore(nextItemIndex + ITEMS_PER_LOAD < initialServices.length);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-semibold mb-6">All experiences</h2>
      {displayedServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center w-full">
          {displayedServices.map((service) => (
            <ServiceCardRecomendation key={service.id} service={service} isFavorite={service.isFavorite} />
          ))}
        </div>
      ) : (
        <p>No services available.</p>
      )}

      {hasMore && (
        <div className="mt-8">
          <SolidButton onClick={handleLoadMore}>
            Load More
          </SolidButton>
        </div>
      )}
    </div>
  );
};

export default ServiceList;