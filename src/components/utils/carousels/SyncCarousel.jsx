import { useState, useRef, useEffect } from "react";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md";
import SubserviceService from "@/services/SubserviceService";
import { useStore } from "@/store";
const VideoLoader = ({ activeItem, videoRef, isMuted }) => {
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !activeItem) {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.style.opacity = "0";
      }
      return;
    }

    const loadVideo = async () => {
      try {
        video.style.opacity = "0";
        video.poster = activeItem.posterSrc;
        video.src = activeItem.videoUrl;
        await video.play();
        video.style.opacity = "1";
      } catch (error) {
        console.error("VideoLoader: Error loading or playing video:", error);
        video.style.opacity = "1";
      }
    };

    loadVideo();

    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.style.opacity = "0";
      }
    };
  }, [activeItem, videoRef]);

  return (
    <video
      ref={videoRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               w-full h-full 
               sm:w-[60vw] sm:max-w-[1000px] sm:h-auto 
               object-cover opacity-0 transition-opacity duration-200"
      muted={isMuted}
      loop
      playsInline
    />
  );
};

const SyncCarousel = () => {
  const store = useStore();
  const { language } = store;
  const videoRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("wena wena");
        const response = await SubserviceService.getWithVideos();
        const data = response.data;
        console.log("la respuesta", response);
        if (data && Array.isArray(data)) {
          console.log("los items", data);
          setItems(data);
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
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleLike = (index) => {
    setLikes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getNearestCardIndex = () => {
    const container = containerRef.current;
    if (!container) return 0;

    const containerCenterX = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let smallestDistance = Infinity;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenterX);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const snapToNearestCard = () => {
    const index = getNearestCardIndex();
    const card = cardsRef.current[index];
    if (!card || !containerRef.current) return;
    containerRef.current.scrollTo({
      left:
        card.offsetLeft -
        (containerRef.current.offsetWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  const handleScroll = () => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(snapToNearestCard, 200);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  if (items.length === 0) {
    return <div className="text-white">Cargando experiencias...</div>;
  }

  return (
    <div className="relative h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-black">
      <VideoLoader
        activeItem={items[activeIndex]}
        videoRef={videoRef}
        isMuted={isMuted}
      />

      <button
        onClick={togglePlayPause}
        className="absolute bottom-[140px] opacity-50 left-4 z-2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-[140px] opacity-50 right-4 z-2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        {isMuted ? (
          <MdVolumeOff className="w-6 h-6 text-black" />
        ) : (
          <MdVolumeUp className="w-6 h-6 text-black" />
        )}
      </button>

      <div
        ref={containerRef}
        className="pt-2 absolute bottom-4 overflow-x-auto w-[500px] xl:w-[750px] overflow-y-hidden max-md:no-scrollbar md:pb-4"
      >
        <div className="snap-x snap-mandatory flex gap-2 px-[calc(50%-175px)]">
          {items.map((item, index) => (
            <article
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="flex-shrink-0 relative w-[300px] max-w-[400px] bg-white/95 backdrop-blur-sm rounded-xl p-2 mx-2 shadow-lg flex gap-4 transition-transform duration-150 hover:scale-105 z-2"
            >
              <img
                src={item.imgUrl}
                alt=""
                className="w-16 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm pt-2 text-gray-600 truncate">
                  <span className="text-red-500">★</span> {item.rate} ·{" "}
                  {item?.duration > 120
                    ? `${(item?.duration / 60).toFixed(1)} hr${
                        item?.duration >= 180 ? "s" : ""
                      }`
                    : `${item?.duration} min`}
                </p>
                <h3 className="text-sm pt-1 text-black">
                  {item.name[language]}
                </h3>
                <p className="text-xs pt-2 text-gray-600 truncate">
                  {item.partner ? "Partner: " + item.partner : ""}
                </p>
              </div>
              <button
                onClick={() => handleLike(index)}
                className={`self-start absolute top-1 right-1 text-2xl transition-colors ${
                  likes.includes(index)
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-400"
                }`}
              >
                {likes.includes(index) ? (
                  <MdFavorite color="tomato" />
                ) : (
                  <MdFavoriteBorder />
                )}
              </button>
            </article>
          ))}
          <div className="flex-shrink-0 w-32" />
        </div>
      </div>
    </div>
  );
};

export default SyncCarousel;
