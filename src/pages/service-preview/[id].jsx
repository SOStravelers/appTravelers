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
import ServiceList from "@/components/service/ServiceList"; // Imported but not used
import RecomendationCarousel from "@/components/utils/carousels/RecomendationCarousel";

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
  const { query, isReady } = useRouter();
  const { id } = query;
  const idSubservice = id;
  const [services, setServices] = useState([]);
  const [subService, setSubservice] = useState({});

  const getData = async () => {
    // ServiceService.list({ isActive: true, page: 1 }).then((response) => {
    //   setServices(response.data.docs);
    //   console.log("get data action!!! yupiiii", services);
    // });
  };

  useEffect(() => {
    if (!services || Object.keys(services).length == 0) {
      getData();
      console.log("here we go!!", services);
    }
  }, []);

  useEffect(() => {
    if (!idSubservice) return;

    const fetchItems = async () => {
      try {
        const { data } = await SubserviceService.getById(idSubservice);
        if (data != null && typeof data === "object" && !Array.isArray(data)) {
          setSubservice(data);
        } else {
          console.warn("La respuesta no es un Object:", data);
        }
      } catch (error) {
        console.error("Error al obtener subServicio", error);
      }
    };

    fetchItems();
  }, [idSubservice]);

  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track which image was clicked/should be shown first

  // In a real application, you would fetch service data based on 'id' here
  const service = placeholderService; // Using placeholder data for now

  if (!service) {
    // Consider adding a proper loading spinner or error message
    return <div>Loading or Service not found...</div>;
  }

  // Function to open carousel from a specific image index
  const openCarousel = (index = 0) => {
    setCurrentImageIndex(index);
    setIsCarouselOpen(true);
  };

  return (
    <div className="mx-auto p-4 md:pl-[240px] py-[60px]">
      {/* Video full-width, ignorando el padding del contenedor */}
      <div
        className="
        relative
        left-1/2 right-1/2
        w-screen
        -translate-x-1/2
        overflow-hidden
        mb-8
      "
      >
        <VideoScreen currentVideo={subService.videoUrl} idService="12345" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-1 px-2 md:p-8">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Main service image */}
          {/* {service.images && service.images.length > 0 && (
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-full h-64 object-cover mb-8 rounded-lg cursor-pointer"
              onClick={() => openCarousel(0)}
            />
          )} */}

          <ServiceHeader
            service={subService}
            serviceType={subService?.service?.name}
          />
          <ServiceInfo service={subService} />
          <ServiceDescription description={subService.details} />
          <InclusionsExclusions
            inclusions={placeholderInclusions}
            exclusions={placeholderExclusions}
          />

          <Gallery
            images={service.images}
            onImageClick={(index) => openCarousel(index)}
            onViewAllClick={() => openCarousel(0)}
          />

          <PointsOfInterestList pointsOfInterest={service.highlightedPoints} />

          <RecomendationCarousel />

          <div className="my-20"></div>

          <BookingPopup
            priceLabel={`Desde R$${subService.price?.category1 || "–"}`}
            subtext="por viajero"
            tagLine="Cancelación gratuita"
            buttonText="Revisa las fechas"
            onAction={() => router.push(`/booking/${idSubservice}`)}
          />
        </div>
      </div>

      {isCarouselOpen && service.images && service.images.length > 0 && (
        <FullScreenCarousel
          images={service.images}
          initialIndex={currentImageIndex}
          onClose={() => setIsCarouselOpen(false)}
        />
      )}
    </div>
  );
};

export default ServicePreviewPage;
