import { useRef, useEffect } from 'react';
import ServiceCardRecomendation from '@/components/utils/cards/ServiceCardRecomendation';

const defaultServices = [
  {
      "_id": "67c11c4917c3a7a2c353cb1b",
      "name": {
          "en": "Matches",
          "es": "Partidos",
          "pt": "Jogos",
          "fr": "Matches",
          "de": "Matches"
      },
      "isActive": true,
      "coverImg": "",
      "updated": {
          "updatedAt": "2023-09-04T12:50:15.610Z"
      },
      "creator": "64f5d2dc7e27ca17eb1e47e5",
      "createdAt": "2023-09-21T12:55:51.758Z",
      "updatedAt": "2023-09-21T21:28:07.416Z",
      "__v": 0,
      "imgUrl": "https://sosappfiles.s3.us-east-1.amazonaws.com/icons/service/ball.png",
      "id": "67c11c4917c3a7a2c353cb1b"
  },
  {
      "_id": "67c11cc117c3a7a2c353cb1c",
      "name": {
          "en": "Tour",
          "es": "Tour",
          "pt": "Tour",
          "fr": "Tour",
          "de": "Tour"
      },
      "isActive": true,
      "coverImg": "",
      "updated": {
          "updatedAt": "2023-09-04T12:50:15.610Z"
      },
      "creator": "64f5d2dc7e27ca17eb1e47e5",
      "createdAt": "2023-09-21T12:55:51.758Z",
      "updatedAt": "2023-09-21T21:28:07.416Z",
      "__v": 0,
      "imgUrl": "https://sosappfiles.s3.us-east-1.amazonaws.com/icons/service/tour-white.png",
      "id": "67c11cc117c3a7a2c353cb1c"
  },
  {
      "_id": "6757137ad2b2668720116ec9",
      "name": {
          "en": "Transfers",
          "es": "Transfers",
          "pt": "Transfers",
          "fr": "Transfers",
          "de": "Transfers"
      },
      "isActive": true,
      "coverImg": "",
      "updated": {
          "updatedAt": "2023-09-04T12:50:15.610Z"
      },
      "creator": "64f5d2dc7e27ca17eb1e47e5",
      "createdAt": "2023-09-21T12:55:51.758Z",
      "updatedAt": "2023-09-21T21:28:07.416Z",
      "__v": 0,
      "imgUrl": "https://sosappfiles.s3.us-east-1.amazonaws.com/icons/service/bus-white.png",
      "id": "6757137ad2b2668720116ec9"
  },
  {
      "_id": "67d39901d2112e5164f10902",
      "name": {
          "en": "Experiences",
          "es": "Experiencias",
          "pt": "Experiências",
          "fr": "Expériences",
          "de": "Erfahrungen"
      },
      "isActive": true,
      "coverImg": "",
      "updated": {
          "updatedAt": "2023-09-04T12:50:15.610Z"
      },
      "creator": "64f5d2dc7e27ca17eb1e47e5",
      "createdAt": "2023-09-21T12:55:51.758Z",
      "updatedAt": "2023-09-21T21:28:07.416Z",
      "__v": 0,
      "imgUrl": "https://sosappfiles.s3.us-east-1.amazonaws.com/icons/service/experience2.png",
      "id": "67d39901d2112e5164f10902"
  }
]

const RecomendationCarousel = ( services=[] ) => {
  console.log('services is...',services['services'])


  const servicesToDisplay = services['services']?.length > 0 ? services['services'] : defaultServices;
  console.log('services to display:',servicesToDisplay)

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
        {/* {servicesToDisplay.map((service, index) => <ServiceCardRecomendation key={service.id} service={service} isFavorite={service.isFavorite} index={index}/>)} */}
      </div>
    </div>
  );
};

export default RecomendationCarousel;