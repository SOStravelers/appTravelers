/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import languageData from "@/language/subServices.json";
//minicambioss
import {
  MdFavorite,
  MdFavoriteBorder,
  MdVolumeUp,
  MdVolumeOff,
  MdIosShare,
} from "react-icons/md";
import FavoriteService from "@/services/FavoriteService";
import { useStore } from "@/store";
export default function VideoScreen({
  currentVideo,
  idService,
  openLoginModal,
  openPopup,
}) {
  const { user, loggedIn, language } = useStore();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  //buena
  /* cambia src + autoplay cuando llega otro vídeo */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !currentVideo) return;
    v.pause();
    v.src = currentVideo;
    v.load();
    v.muted = isMuted;
    v.play().catch(() => {});
  }, [currentVideo, isMuted]);

  /* sync play/pause estado local */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    FavoriteService.isFavorite(idService)
      .then(({ data }) => {
        data && data.isFavorite ? setLiked(true) : setLiked(false);
      })
      .catch(console.error);
  }, [user]);

  const handleLike = async () => {
    console.log("va el like", user);
    if (!loggedIn) {
      console.log("no user");
      openLoginModal();
      return;
    }
    try {
      setLiked((prev) => !prev);
      !liked ? openPopup(true, "added") : openPopup(true, "removed");

      !liked
        ? await FavoriteService.addFavorite(idService)
        : await FavoriteService.removeFavorite(idService);
    } catch (err) {
      console.log(err);
    }
  };

  const shareLink = () => {
    const fullShareUrl = `${window.location.origin}/share/${idService}?lang=${language}`;
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: languageData.shareText.text[language],
          url: fullShareUrl,
        })
        .then(() => console.log("Compartido con éxito"))
        .catch((error) => console.error("Error al compartir:", error));
    } else {
      // Fallback: Copiar link si no soporta Web Share API
      navigator.clipboard.writeText(fullShareUrl);
      alert("Link copiado al portapapeles");
    }
  };

  return (
    <div className="relative h-[50vh] flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
      />

      {/* play / pause */}
      <button
        onClick={() => {
          const v = videoRef.current;
          isPlaying ? v.pause() : v.play();
        }}
        className="absolute bottom-[10px] left-2 opacity-50 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
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

      {/* mute */}
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="absolute bottom-[10px] right-2 opacity-50 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
      >
        {isMuted ? (
          <MdVolumeOff className="w-6 h-6" />
        ) : (
          <MdVolumeUp className="w-6 h-6" />
        )}
      </button>

      {/* like */}
      <button
        onClick={() => handleLike()}
        className="absolute top-4 right-2 p-2 bg-white/80  opacity-90  rounded-full"
      >
        {liked ? (
          <MdFavorite className="w-6 h-6 text-red-500" />
        ) : (
          <MdFavoriteBorder className="w-6 h-6" />
        )}
      </button>

      {/* share */}
      <button
        onClick={() => shareLink()}
        className="absolute top-4 right-16 p-2 bg-white/80  opacity-90  rounded-full"
      >
        <MdIosShare className="w-6 h-6 " />
      </button>
    </div>
  );
}
console.log("🟢 VideoScreen actualizado");
