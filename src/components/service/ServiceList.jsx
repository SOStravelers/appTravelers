import  { useState, useEffect } from 'react';
import SolidButton from '@/components/utils/buttons/SolidButton';
import ServiceCard from './SubServiceCard'; // Import the new ServiceCard component

const ITEMS_PER_LOAD = 4;

const ServiceList = ({ services: initialServices = [] }) => {
  const exampleServices = [
    {
      id: 1,
      name: "Prepare your own vinegar with an expert",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
      score: 4.83,
      scoreCount: 24,
      duration: "2 hours",
      price: 69,
      isFavorite: true,
    },
    {
      id: 2,
      name: "Live a local match at Vasco da Gama",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
      score: 4.83,
      scoreCount: 24,
      duration: "3,5 hours",
      price: 88,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Join a conservation mission",
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
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
  }, []);

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
        <div className="grid grid-cols-2 sm:grid-cols-2 min-md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center w-full">
          {displayedServices.map((service) => (
            <ServiceCard key={service.id} service={service} /> 
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