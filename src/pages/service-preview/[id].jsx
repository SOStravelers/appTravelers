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
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
import FloatingFavoriteToast from "@/components/utils/modal/FloatingFavoriteToast";
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
  const { language, service, setService, currency, user, loggedIn } =
    useStore();
  const [openLogin, setOpenLogin] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);
  const [subService, setSubservice] = useState({});
  const [loading, setLoading] = useState(true); // <-- loading flag
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [stateTextFavorite, setStateTextFavorite] = useState("");
  const [price, setPrice] = useState({
    eur: { value: null, formated: "- €" },
    usd: { value: null, formated: "- USD" },
    brl: { value: null, formated: "R$ -" },
  });
  const [validPrice, setValidPrice] = useState(false);

  useEffect(() => {
    document.title = "Preview Subservice | SOS Travelers";
  }, []);

  const openModal = () => {
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
          setService(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);
  //minicambio
  // build combined media array
  const images = subService.gallery?.images || [];
  const videos = subService.gallery?.videos || [];
  const media = [
    ...images.map((url) => ({ url, type: "image" })),
    ...videos.map((url) => ({ url, type: "video" })),
  ];

  useEffect(() => {
    if (subService.typeService == "tour") {
      setPrice(subService?.tourData?.adultPrice);
      setValidPrice(true);
    } else {
      setPrice({
        eur: { value: null, formated: "- €" },
        usd: { value: null, formated: "- USD" },
        brl: { value: null, formated: "R$ -" },
      });
      setValidPrice(false);
    }
  }, [subService, currency]);

  const openCarousel = (idx = 0) => {
    setCurrentMediaIndex(idx);
    setIsCarouselOpen(true);
  };

  const openPopupFavorite = (state, text) => {
    setShowToast(true);
    setStateTextFavorite(text);
  };

  return (
    <>
      <div className="mx-auto px-4 md:pl-[240px] bg-gray-50 ">
        {/* fade + slide container */}
        <div className={`${loading ? opacityAnimation : displayAnimation}`}>
          {/* Video full-width */}
          {(subService.videoUrl || subService.imgUrl) && (
            <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden mb-2">
              {subService.videoUrl ? (
                <VideoScreen
                  currentVideo={subService.videoUrl}
                  idService={id}
                  openLoginModal={() => setOpenLogin(true)}
                  openPopup={openPopupFavorite}
                />
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
          priceLabel={`${languageData.bookingButton.title[language]} ${
            price[currency].formated || price["brl"].formated
          }`}
          subtext={languageData.bookingButton.subtitle[language]}
          tagLine={languageData.bookingButton.cancel[language]}
          buttonText={languageData.bookingButton.goDates[language]}
          onAction={() => openModal(true)} // <-- abre el modal
          isDisabled={validPrice && price[currency].value > 0 ? false : true}
        />
      </div>
      <ModalReservationWrapper
        isOpen={openReservation}
        onClose={() => setOpenReservation(false)}
      />

      {!loggedIn && (
        <LoginFormModal
          open={openLogin}
          setOpen={setOpenLogin}
          title="Login to continue"
        />
      )}

      <FloatingFavoriteToast
        visible={showToast}
        onClose={() => setShowToast(false)}
        imgUrl={service.imgUrl}
        state={stateTextFavorite}
      />
    </>
  );
}
