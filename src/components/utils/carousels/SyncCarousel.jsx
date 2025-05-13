import { useState, useRef, useEffect } from 'react';

const DEFAULT_ITEMS = [
  {
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterSrc:'',
    thumbnailSrc: 'https://picsum.photos/seed/fire_thumb/100/130',
    // rating: '5.0 (187)',
    // duration: '1.5 h',
    title: 'Aprende a tragar fuego',
    host: 'Anfitrión: Catherine'
  },
  {
    videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterSrc:'',
    thumbnailSrc: 'https://picsum.photos/seed/surf_thumb/100/130',
    rating: '4.9 (95)',
    duration: '2 h',
    title: 'Clase de surf en la playa',
    host: 'Anfitrión: Alex'
  },
  {
    videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailSrc: 'https://picsum.photos/seed/stars_thumb/100/130',
    rating: '4.8 (250)',
    duration: '3 h',
    title: 'Observación de estrellas',
    host: 'Anfitrión: Dr. Orion'
  },
];

const VideoLoader = ({ activeItem, videoRef }) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeItem) return;

    const loadVideo = async () => {
      try {
        video.style.opacity = '0';
        video.poster = activeItem.posterSrc;
        video.src = activeItem.videoSrc;
        
        await video.load();
        await video.play();
        video.style.opacity = '1';
      } catch (error) {
        console.error('Error loading video:', error);
        video.style.opacity = '1';
      }
    };

    const timer = setTimeout(loadVideo, 150);
    return () => {
      video.pause();
      clearTimeout(timer);
    };
  }, [activeItem, videoRef]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-200"
      muted
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
    setLikes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
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
        closestIndex= index;
      }
    });

    return closestIndex;
  };

  const snapToNearestCard = () => {
    const index = getNearestCardIndex();
    const card = cardsRef.current[index];
    if (!card || !containerRef.current) return;
    containerRef.current.scrollTo({
      left: card.offsetLeft - (containerRef.current.offsetWidth - card.offsetWidth) / 2 ,
      behavior: 'smooth'
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
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[90vh] flex flex-col justify-center items-center  overflow-hidden">
      <VideoLoader activeItem={items[activeIndex]} videoRef={videoRef} />
      
      <button
        onClick={togglePlayPause}
        className="absolute bottom-44 opacity-50 left-4 z-2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
      > 
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      <div ref={containerRef} className="absolute bottom-8  overflow-x-auto scrollbar-hidden no-scrollbar" >
        <div className="snap-x snap-mandatory flex justify-left gap-5 w-[500px] md:w-[1000px] md:pr-[calc(100%+300px)] px-[calc(50%-150px)]">
          {items.map((item, index) => (
            <article
              key={item.videoSrc}
              ref={el => cardsRef.current[index] = el}
              className="flex-shrink-0 w-[270px] max-w-[400px] bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg flex gap-4 transition-transform duration-150 hover:scale-105 z-2"
            >
              <img src={item.thumbnailSrc} alt="" className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 truncate">
                  <span className="text-red-500">★</span> {item.rating} · {item.duration}
                </p>
                <h3 className="text-md font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray-600 truncate">{item.host}</p>
              </div>
              <button
                onClick={() => handleLike(index)}
                className={`self-start text-2xl transition-colors ${
                  likes.includes(index) ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                }`}
              >
                {likes.includes(index) ? '❤️' : '♡'}
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