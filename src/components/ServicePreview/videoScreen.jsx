import React, { useState, useRef, useEffect } from "react";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md";

/**
 * VideoScreen
 * Componente de video simplificado para un solo video.
 * Props:
 * - currentVideo: string (URL del video a reproducir)
 * - idService: string | number (identificador del servicio)
 */
const VideoScreen = ({ currentVideo, idService }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  // Carga y reproduce el video al montar o cuando cambia currentVideo
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideo) return;
    video.pause();
    video.src = currentVideo;
    video.load();
    video.muted = isMuted;
    video.play().catch(() => {
      /* Autoplay puede fallar si no está muted */
    });
  }, [currentVideo, isMuted]);

  // Actualiza estado de play/pause
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
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    isPlaying ? video.pause() : video.play();
  };

  const toggleMute = () => setIsMuted((m) => !m);
  const toggleLike = () => setLiked((l) => !l);

  return (
    <div className="relative h-[50vh] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
      />

      {/* Controles */}
      <button
        onClick={togglePlayPause}
        className="absolute bottom-4 left-4 p-2 bg-white/80 rounded-full shadow-lg"
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
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-2 bg-white/80 rounded-full shadow-lg"
      >
        {isMuted ? (
          <MdVolumeOff className="w-6 h-6 text-black" />
        ) : (
          <MdVolumeUp className="w-6 h-6 text-black" />
        )}
      </button>

      <button
        onClick={toggleLike}
        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-lg"
      >
        {liked ? (
          <MdFavorite className="w-6 h-6 text-red-500" />
        ) : (
          <MdFavoriteBorder className="w-6 h-6 text-gray-700" />
        )}
      </button>
    </div>
  );
};

export default VideoScreen;
