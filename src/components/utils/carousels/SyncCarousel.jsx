import { useState, useRef, useEffect } from "react";
import { formatTime } from "@/lib/time";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md";
import SubserviceService from "@/services/SubserviceService";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import LoginFormModal from "@/components/utils/modal/LoginFormModal";
const VideoLoader = ({ activeItem, videoRef, isMuted }) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeItem?.videoUrl) {
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
        video.pause();
        video.removeAttribute("src");
        video.load();

        video.poster = activeItem.imgUrl;
        video.src = activeItem.videoUrl;

        await new Promise((resolve) => {
          const onCanPlay = () => {
            video.removeEventListener("canplay", onCanPlay);
            resolve();
          };
          video.addEventListener("canplay", onCanPlay);
        });

        await video.play();
        video.style.opacity = "1";
      } catch (err) {
        console.error("VideoLoader:", err);
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
  }, [activeItem?.videoUrl]);

  return (
    <video
      ref={videoRef}
      className={
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " +
        "w-full h-full sm:w-[60vw] sm:max-w-[1000px] sm:h-auto " +
        "object-cover opacity-0 transition-opacity duration-200"
      }
      muted={isMuted}
      loop
      playsInline
    />
  );
};

export default function SyncCarousel() {
  var user = Cookies.get("auth.user_id");
  const router = useRouter();
  const { language } = useStore();
  const videoRef = useRef(null);
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likes, setLikes] = useState([]);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    SubserviceService.getWithVideos()
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          setActiveIndex(0);
        }
      })
      .catch((err) => console.error("Fetch videos:", err));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [items]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  // like-button logic: opens modal if no user, else toggles like
  const onLikeButton = (newState, id) => {
    console.log("entra", newState);
    if (!user) {
      console.log("entra 2");
      setOpen(true);
      return false;
    }
    // could call an API to persist the like here...
    return true;
  };

  const handleLike = (i, item) => {
    const newState = !likes.includes(i);
    console.log("newState", newState);
    if (onLikeButton(newState, item._id)) {
      setLikes((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
      );
    }
  };

  const getNearestCardIndex = () => {
    const c = containerRef.current;
    if (!c) return 0;
    const center = c.scrollLeft + c.offsetWidth / 2;
    let best = 0,
      minDist = Infinity;
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < minDist) {
        minDist = d;
        best = i;
      }
    });
    return best;
  };

  const snapToNearest = () => {
    const i = getNearestCardIndex();
    const card = cardsRef.current[i];
    if (!card) return;
    containerRef.current.scrollTo({
      left:
        card.offsetLeft -
        (containerRef.current.offsetWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
    setActiveIndex(i);
  };

  const onScroll = () => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(snapToNearest, 200);
  };

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.addEventListener("scroll", onScroll);
    return () => {
      c.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [items]);

  if (items.length === 0)
    return <div className="text-white">Cargando experiencias...</div>;

  return (
    <div className="relative h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-black">
      {/* Video + fades */}
      <div className="relative w-full h-full">
        <VideoLoader
          key={items[activeIndex].videoUrl}
          activeItem={items[activeIndex]}
          videoRef={videoRef}
          isMuted={isMuted}
        />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white" />
      </div>

      {/* Controls */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-[140px] left-4 opacity-50 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="absolute bottom-[140px] right-4 opacity-50 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        {isMuted ? (
          <MdVolumeOff className="w-6 h-6 text-black" />
        ) : (
          <MdVolumeUp className="w-6 h-6 text-black" />
        )}
      </button>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="absolute bottom-4 w-[500px] xl:w-[750px] overflow-x-auto overflow-y-hidden pt-2 md:pb-4"
      >
        <div className="flex snap-x snap-mandatory gap-2 px-[calc(50%-175px)]">
          {items.map((item, i) => (
            <article
              key={i}
              onClick={() => router.push(`/service-preview/${item._id}`)}
              ref={(el) => (cardsRef.current[i] = el)}
              className="flex-shrink-0 relative w-[300px] max-w-[400px] bg-white/95 backdrop-blur-sm rounded-xl p-2 mx-2 shadow-lg flex gap-4 hover:scale-105 transition-transform duration-150 cursor-pointer"
            >
              <img
                src={item.imgUrl}
                alt=""
                className="w-16 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm pt-2 text-gray-600 truncate">
                  <span className="text-red-500">★</span> {item.rate} ·{" "}
                  {formatTime(item.duration)}
                </p>
                <h3 className="text-sm pt-1 text-black">
                  {item.name[language]}
                </h3>
                <p className="text-xs pt-2 text-gray-600 truncate">
                  {item.partner && `Partner: ${item.partner}`}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(i, item);
                }}
                className={`absolute top-1 right-1 text-2xl transition-colors ${
                  likes.includes(i)
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-400"
                }`}
              >
                {likes.includes(i) ? <MdFavorite /> : <MdFavoriteBorder />}
              </button>
            </article>
          ))}
          <div className="flex-shrink-0 w-32" />
        </div>
        {/* Modal login */}
        {!user && (
          <LoginFormModal
            open={open}
            setOpen={setOpen}
            title="Login to continue"
          />
        )}
      </div>
    </div>
  );
}
