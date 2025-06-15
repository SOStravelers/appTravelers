import { useState, useRef, useEffect } from "react";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite, MdVolumeUp, MdVolumeOff } from "react-icons/md";

const DEFAULT_ITEMS = [
  // {
  //   videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  //   posterSrc:'',
  //   thumbnailSrc: 'https://picsum.photos/seed/fire_thumb/100/130',
  //   // rating: '5.0 (187)',
  //   // duration: '1.5 h',
  //   title: 'Aprende a tragar fuego',
  //   host: 'Anfitrión: Catherine'
  // },
  // {
  //   videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  //   posterSrc:'',
  //   thumbnailSrc: 'https://picsum.photos/seed/surf_thumb/100/130',
  //   rating: '4.9 (95)',
  //   duration: '2 h',
  //   title: 'Clase de surf en la playa',
  //   host: 'Anfitrión: Alex'
  // },
  // {
  //   videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  //   thumbnailSrc: 'https://picsum.photos/seed/stars_thumb/100/130',
  //   rating: '4.8 (250)',
  //   duration: '3 h',
  //   title: 'Observación de estrellas',
  //   host: 'Anfitrión: Dr. Orion'
  // },
  // {
  //   videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  //   posterSrc:'',
  //   thumbnailSrc: 'https://picsum.photos/seed/fire_thumb/100/130',
  //   // rating: '5.0 (187)',
  //   // duration: '1.5 h',
  //   title: 'Aprende a tragar fuego',
  //   host: 'Anfitrión: Catherine'
  // },
  // {
  //   videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  //   posterSrc:'',
  //   thumbnailSrc: 'https://picsum.photos/seed/surf_thumb/100/130',
  //   rating: '4.9 (95)',
  //   duration: '2 h',
  //   title: 'Clase de surf en la playa',
  //   host: 'Anfitrión: Alex'
  // },
  // {
  //   videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  //   thumbnailSrc: 'https://picsum.photos/seed/stars_thumb/100/130',
  //   rating: '4.8 (250)',
  //   duration: '3 h',
  //   title: 'Observación de estrellas',
  //   host: 'Anfitrión: Dr. Orion'
  // },
  // {
  //   videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  //   posterSrc:'',
  //   thumbnailSrc: 'https://picsum.photos/seed/fire_thumb/100/130',
  //   // rating: '5.0 (187)',
  //   // duration: '1.5 h',
  //   title: 'Aprende a tragar fuego',
  //   host: 'Anfitrión: Catherine'
  // },
  // {
  //   videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  //   posterSrc:'',
  //   thumbnailSrc: 'https://picsum.photos/seed/surf_thumb/100/130',
  //   rating: '4.9 (95)',
  //   duration: '2 h',
  //   title: 'Clase de surf en la playa',
  //   host: 'Anfitrión: Alex'
  // },
  // {
  //   videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  //   thumbnailSrc: 'https://picsum.photos/seed/stars_thumb/100/130',
  //   rating: '4.8 (250)',
  //   duration: '3 h',
  //   title: 'Observación de estrellas',
  //   host: 'Anfitrión: Dr. Orion'
  // },
  {
    videoSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/%F0%9F%93%8DStade+Maracana+%2C+RIO%2C+BRESIL+Quel+expe%CC%81rience+plus+authentique+que+d'assister+a%CC%80+un+match+de+foot+dans+le+ce%CC%81le%CC%80bre+stade+du+Maracana.+Pays+du+football%2C+c'e%CC%81tait+une+e%CC%81vidence+pour+les+passionne%CC%81s+de+sport+que+nous+sommes.+Et+quelle+amb.mp4",
    thumbnailSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/foto1maracana.jpg",
    rating: "4.8 (250)",
    duration: "3 h",
    title: "Maracaná experience",
    host: "Anfitrión: Dr. Orion",
  },
  {
    videoSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/FPV+Tour+of+Rocinha+As+one+of+the+largest+Favelas+in+the+world+It+was+really+incredible+to+see+from+an+FPV+perspective.+Really+need+to+position+yourself+well+or+you%E2%80%99ll+never+find+your+way+back.+That%E2%80%99s+of+course+if+you+can+even+get+permi.mp4",
    thumbnailSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/foto2rocinha.jpg",
    rating: "4.8 (250)",
    duration: "3 h",
    title: "Rocinha Tour",
    host: "Anfitrión: Dr. Orion",
  },
  {
    videoSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/Ao+nascer+do+sol%2C+o+Cristo+Redentor+nos+lembra+que+as+miserico%CC%81rdias+do+Senhor+se+renovam+a+cada+manha%CC%83+%E2%98%80%EF%B8%8F%F0%9F%99%8C%E2%9C%A8+Que+essa+imagem+toque+o+seu+corac%CC%A7a%CC%83o+como+tocou+o+meu!+Se+Jesus+e%CC%81+a+luz+da+sua+vida%2C+curta+%E2%9D%A4%EF%B8%8F%2C+comente+%F0%9F%99%8F+e+compar.mp4",
    thumbnailSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/foto4cristo.jpg",
    rating: "4.8 (250)",
    duration: "3 h",
    title: "Tour Cristo",
    host: "Anfitrión: Dr. Orion",
  },
  {
    videoSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/Trilha+Dois+Irma%CC%83os+-+Vidigal+%F0%9F%87%A7%F0%9F%87%B7+Ao+chegar+no+Vidigal%2C+pegar+moto+ta%CC%81xi+para+trilha+(7%2C00).+A+subida+tem+um+custo+de+10%2C00+e+durou+em+me%CC%81dio+50-70+min+que+compensaram+muito+com+uma+vista+360%C2%B0+da+cidade+maravilhosa!+%23trilha+%23vidigal+%23.mp4",
    thumbnailSrc:
      "https://sosappfiles.s3.us-east-1.amazonaws.com/test+videos/foto3doisirmaos.jpeg",
    rating: "4.8 (250)",
    duration: "3 h",
    title: "Trilha Dois Irmãos",
    host: "Anfitrión: Dr. Orion",
  },
];

const VideoLoader = ({ activeItem, videoRef, isMuted }) => {
  // Component receives videoRef prop

  useEffect(() => {
    const video = videoRef.current;

    // --- Handle cases where video element or activeItem are missing ---
    // If video element or active item data is not available, ensure the video is stopped and hidden.
    if (!video || !activeItem) {
      // Explicitly clean up the video element if it exists but activeItem is gone
      if (video) {
        video.pause(); // Stop playback
        video.removeAttribute("src"); // Remove the source to release resources
        video.load(); // Reset the media element state
        video.style.opacity = "0"; // Hide the video
      }
      // No need to clear a timer here if no timer was set due to the guard clause
      return; // Exit the effect early
    }

    // --- Define the async function to load and play the video ---
    const loadVideo = async () => {
      try {
        // Hide the video immediately before loading the new source
        video.style.opacity = "0";

        // Set the poster and video source
        video.poster = activeItem.posterSrc;
        video.src = activeItem.videoSrc;

        // Note: Setting video.src often implicitly triggers loading.
        // video.load() can be redundant in many modern browser scenarios after setting src,
        // but you can keep it if you encounter specific loading issues without it.
        // await video.load(); // Consider if this line is truly necessary

        // Attempt to play the video. This also handles loading if not already started.
        await video.play();
        // Fade in the video once playback starts successfully
        video.style.opacity = "1";
      } catch (error) {
        // Handle errors during loading or playback (e.g., autoplay blocked, file not found)
        console.error("VideoLoader: Error loading or playing video:", error);
        // Decide how to handle errors visually: show poster, hide video, show error message.
        // Matching original behavior: show the video (likely showing poster or broken state)
        video.style.opacity = "1";
      }
    };

    // --- Execute the video loading logic ---
    // Removed the setTimeout. Effect should react immediately to dependency changes.
    loadVideo();

    // --- Cleanup function ---
    // This runs when the dependencies (activeItem, videoRef) change
    // or when the component unmounts. It ensures the previous video stops and resources are released.
    return () => {
      // Check if the video element still exists before trying to access its methods
      if (video) {
        video.pause(); // Pause any currently playing video
        // Removing src is good practice to release network/memory resources
        video.removeAttribute("src");
        video.load(); // Reset the media element state after removing src
        // Hide the video immediately during cleanup/switching
        video.style.opacity = "0";
      }
      // Since we removed the setTimeout, there's no timer to clear here.
      // clearTimeout(timer); // This line is removed
    };
  }, [activeItem, videoRef]); // Dependency array: effect re-runs when activeItem or videoRef changes

  // The component renders the video element and attaches the ref passed from the parent
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

const SyncCarousel = ({ items = DEFAULT_ITEMS }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const scrollTimeout = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleLike = async (index) => {
    // Simulación de petición API (descomentar para implementación real)
    /*
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        body: JSON.stringify({ itemId: index })
      });
      if (!response.ok) throw new Error('Error en la petición');
    } catch (error) {
      console.error('Error:', error);
      return;
    }
    */

    // Actualización optimista del estado local
    setLikes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

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
      if (Math.abs(cardCenter - containerCenterX) < smallestDistance) {
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
        <div className="snap-x snap-mandatory flex gap-2  px-[calc(50%-175px)]">
          {items.map((item, index) => (
            <article
              // key={item.videoSrc}
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="flex-shrink-0 relative w-[300px] max-w-[400px] bg-white/95 backdrop-blur-sm rounded-xl p-2 mx-2 shadow-lg flex gap-4 transition-transform duration-150 hover:scale-105 z-2"
            >
              <img
                src={item.thumbnailSrc}
                alt=""
                className="w-16 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm pt-2 text-gray-600 truncate">
                  <span className="text-red-500">★</span> {item.rating} ·{" "}
                  {item.duration}
                </p>
                <h3 className="text-sm pt-1 text-black">{item.title}</h3>
                <p className="text-xs pt-2  text-gray-600 truncate">
                  {item.host}
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
