// pages/ServicePreviewPage.jsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import ServiceService from "@/services/ServiceService";
import SubserviceService from "@/services/SubserviceService";

import ServiceHeader from "@/components/ServicePreview/ServiceHeader";
import ServiceInfo from "@/components/ServicePreview/ServiceInfo";
import ServiceDescription from "@/components/ServicePreview/ServiceDescription";
import PointsOfInterestList from "@/components/ServicePreview/PointsOfInterestList";
import Gallery from "@/components/ServicePreview/Gallery";
import FullScreenCarousel from "@/components/ServicePreview/FullScreenCarousel";
import VideoScreen from "@/components/ServicePreview/VideoScreen";
import InclusionsExclusions from "@/components/ServicePreview/InclusionsExclusions";
import BookingPopup from "@/components/ServicePreview/BookingPopup";
import RecomendationCarousel from "@/components/utils/carousels/RecomendationCarousel";

// Placeholder Data (replace with actual data fetching later)
// Placeholder Data (replace with actual data fetching later)
const placeholderService = {
  id: "1",
  type: "Free tour",
  title: "El mejor Free free tour por el Centro y Lapa",
  score: 4.49,
  scoreCount: 367,
  location: "Rio de Janeiro",
  duration: "3 horas",
  languages: ["Inglés", "Español", "Portugués"],
  reviewsLink: "#", // Placeholder for a reviews link
  description:
    "Viaja en el tiempo en nuestro Free Tour Rio a Pie por el Centro y Lapa y revive el pasado mientras caminas por las encantadoras calles coloniales de Rio y aprendes sobre los cuatro siglos de historia de la ciudad. Únase a nuestro recorrido para comprender más sobre la...",
  highlightedPoints: [
    {
      type: "Punto de encuentro",
      location: "Largo da Carioca - Centro, Rio de Janeiro - RJ, Brasil",
      details:
        "Frente a la Torre del Reloj de la Plaza Carioca en camisetas rojas",
      mapLink: "#", // Placeholder for a map link
    },
    {
      type: "Visita exterior",
      location: "Largo da Carioca - Centro",
      details: null,
    },
    {
      type: "Visita exterior",
      location: "Confeitaria Colombo - Rua Gonçalves",
      details: null,
    },
  ],

  gallery: {
    images: [
      "https://media.istockphoto.com/id/143918363/es/foto/pie-alto.jpg?s=612x612&w=0&k=20&c=RChPH41W9XygEkKgOo9rYxN_qV13YF4q6oiSGM94MWs=",
      "https://cdn.pixabay.com/photo/2017/07/07/18/10/island-2482200_1280.jpg",
      "https://media.istockphoto.com/id/1368808461/es/foto/mujer-joven-alimentando-peces-en-playa-tropical.jpg?s=612x612&w=0&k=20&c=9sQY6faWPAaN_XMXF3qlsqzDm9S5NY64XFvHGTtJKxE=",
      "https://cdn.pixabay.com/photo/2017/07/07/18/10/island-2482200_1280.jpg",
      "https://media.istockphoto.com/id/143918363/es/foto/pie-alto.jpg?s=612x612&w=0&k=20&c=RChPH41W9XygEkKgOo9rYxN_qV13YF4q6oiSGM94MWs=",
      "https://cdn.pixabay.com/photo/2017/07/07/18/10/island-2482200_1280.jpg",
      "https://media.istockphoto.com/id/143918363/es/foto/pie-alto.jpg?s=612x612&w=0&k=20&c=RChPH41W9XygEkKgOo9rXyN_qV13YF4q6oiSGM94MWs=",
      "https://cdn.pixabay.com/photo/2017/07/07/18/10/island-2482200_1280.jpg",
      "https://media.istockphoto.com/id/143918363/es/foto/pie-alto.jpg?s=612x612&w=0&k=20&c=RChPH41W9XygEkKgOo9rYxN_qV13YF4q6oiSGM94MWs=",
    ],
    videos: [
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/Trilha+Dois+Irma%CC%83os+-+Vidigal+%F0%9F%87%A7%F0%9F%87%B7+Ao+chegar+no+Vidigal%2C+pegar+moto+ta%CC%81xi+para+trilha+(7%2C00).+A+subida+tem+um+custo+de+10%2C00+e+durou+em+me%CC%81dio+50-70+min+que+compensaram+muito+com+uma+vista+360%C2%B0+da+cidade+maravilhosa!+%23trilha+%23vidigal+%23.mp4",
    ],
  },
};

// Placeholder data for inclusions and exclusions
const placeholderInclusions = [
  { text: "Servicio de recogida y regreso al hotel.", included: true },
  {
    text: "Tarifas de entrada al Cristo Redentor, la catedral y el Pan de Azúcar",
    included: true,
  },
  {
    text: "Visitas externos a la escalera de Selarón, el estadio de Maracaná y el Sambódromo",
    included: true,
  },
  { text: "Guía multilingüe", included: true },
  { text: "Bebidas y postre", included: false },
  { text: "Entrada al Maracaná y al Sambódromo", included: false },
];

const placeholderExclusions = [
  { text: "Personas con problemas de movilidad", included: false },
  { text: "Personas en silla de ruedas", included: false },
];

const ServicePreviewPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const idSubservice = id;
  const [subService, setSubservice] = useState({});
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Fetch dinámico de subservice
  useEffect(() => {
    if (!idSubservice) return;
    SubserviceService.getById(idSubservice)
      .then(({ data }) => {
        if (data && typeof data === "object") setSubservice(data);
      })
      .catch(console.error);
  }, [idSubservice]);

  // Media combinada para FullScreenCarousel
  const images = placeholderService.gallery.images;
  const videos = placeholderService.gallery.videos;
  const media = [
    ...images.map((url) => ({ url, type: "image" })),
    ...videos.map((url) => ({ url, type: "video" })),
  ];

  const openCarousel = (idx = 0) => {
    console.log("hola");
    setCurrentMediaIndex(idx);
    setIsCarouselOpen(true);
    console.log("vamos", isCarouselOpen && media.length > 0);
  };

  return (
    <div className="mx-auto p-4 md:pl-[240px] py-[60px]">
      {/* Video full-width */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden mb-8">
        <VideoScreen
          currentVideo={subService.videoUrl}
          idService={idSubservice}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-1 px-2 md:p-8">
        <div className="flex-1">
          <ServiceHeader
            service={subService}
            serviceType={subService.service?.name}
          />
          <ServiceInfo service={subService} />
          <ServiceDescription description={subService.details} />
          <InclusionsExclusions
            inclusions={placeholderInclusions}
            exclusions={placeholderExclusions}
          />

          <Gallery
            images={images}
            videos={videos}
            onImageClick={(idx) => openCarousel(idx)}
            onViewAllClick={() => openCarousel(0)}
          />

          <PointsOfInterestList
            pointsOfInterest={placeholderService.highlightedPoints}
          />
          <RecomendationCarousel />

          <div className="my-20" />

          <BookingPopup
            priceLabel={`Desde R$${subService.price?.category1 || "–"}`}
            subtext="por viajero"
            tagLine="Cancelación gratuita"
            buttonText="Revisa las fechas"
            onAction={() => router.push(`/booking/${idSubservice}`)}
          />
        </div>
      </div>

      {isCarouselOpen && media.length > 0 && (
        <FullScreenCarousel
          media={media}
          initialIndex={currentMediaIndex}
          onClose={() => setIsCarouselOpen(false)}
        />
      )}
    </div>
  );
};

export default ServicePreviewPage;
