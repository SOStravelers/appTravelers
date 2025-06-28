// pages/ServicePreviewPage.jsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
import languageData from "@/language/subServices.json";
import { useStore } from "@/store";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import Reservation from "../reservation/[id]";
import ModalReservationWrapper from "@/components/ServicePreview/ModalReservationWrapper";
export default function ServicePreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const { language, setService } = useStore();
  const [openReservation, setOpenReservation] = useState(false);
  const [subService, setSubservice] = useState({});
  const [loading, setLoading] = useState(true); // <-- loading flag
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    document.title = "Preview Subservice | SOS Travelers";
  }, []);

  const openModal = () => {
    console.log("wena");
    setService(subService);
    setOpenReservation(true);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    SubserviceService.getById(id)
      .then(({ data }) => {
        if (data && typeof data === "object") {
          setSubservice(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // build combined media array
  const images = subService.gallery?.images || [];
  const videos = subService.gallery?.videos || [];
  const media = [
    ...images.map((url) => ({ url, type: "image" })),
    ...videos.map((url) => ({ url, type: "video" })),
  ];

  const openCarousel = (idx = 0) => {
    setCurrentMediaIndex(idx);
    setIsCarouselOpen(true);
  };

  return (
    <div className="mx-auto px-4 md:pl-[240px] bg-gray-50 ">
      {/* fade + slide container */}
      <div className={`${loading ? opacityAnimation : displayAnimation}`}>
        {/* Video full-width */}
        {(subService.videoUrl || subService.imgUrl) && (
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden mb-2">
            {subService.videoUrl ? (
              <VideoScreen currentVideo={subService.videoUrl} idService={id} />
            ) : (
              <img
                src={subService.imgUrl}
                alt={subService.id}
                className="w-full h-64 object-cover mb-2 rounded-lg cursor-pointer"
                onClick={() => openCarousel(0)}
              />
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-lg px-2 md:p-8 border-b-2 border-gray-400 bg-softWhite rounded-xl shadow-[0_4px_4px_-2px_rgba(0,0,0,0.1)]">
          <div className="flex-1">
            <ServiceHeader
              service={subService}
              serviceType={subService.service?.name}
            />
            <ServiceInfo service={subService} />
            <ServiceDescription description={subService.details} />
            <InclusionsExclusions
              inclusions={subService.includedList}
              exclusions={subService.restrictions}
            />
            <Gallery
              images={images}
              videos={videos}
              onImageClick={(idx) => openCarousel(idx)}
              onViewAllClick={() => openCarousel(0)}
            />
            <PointsOfInterestList pointsOfInterest={subService.route} />
            <div className="my-20" />
          </div>
        </div>

        <div className="mt-12 mb-20">
          <RecomendationCarousel />
        </div>

        {isCarouselOpen && media.length > 0 && (
          <FullScreenCarousel
            media={media}
            initialIndex={currentMediaIndex}
            onClose={() => setIsCarouselOpen(false)}
          />
        )}
      </div>
      <BookingPopup
        priceLabel={`${languageData.bookingButton.title[language]} R$${
          subService.price?.category1 ?? "–"
        }`}
        subtext={languageData.bookingButton.subtitle[language]}
        tagLine={languageData.bookingButton.cancel[language]}
        buttonText={languageData.bookingButton.goDates[language]}
        onAction={() => openModal(true)} // <-- abre el modal
      />

      <ModalReservationWrapper
        isOpen={openReservation}
        onClose={() => setOpenReservation(false)}
      />
    </div>
  );
}
