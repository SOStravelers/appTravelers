// src/components/utils/FloatingFavoriteToast.jsx
import { useEffect, useState } from "react";
import languageData from "@/language/favorites.json";
import { useStore } from "@/store";
export default function FloatingFavoriteToast({
  visible,
  onClose,
  imgUrl,
  state,
}) {
  const [show, setShow] = useState(false);
  const { language } = useStore();
  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000); // Se muestra por 3 segundos
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div
      className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 
  transition-all duration-700 ease-in-out
  ${
    show
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 translate-y-4 pointer-events-none"
  }
  bg-white rounded-xl shadow-xl px-4 py-3 flex items-center space-x-3 border w-64`}
    >
      <img
        src={imgUrl}
        alt="Favorito"
        className="w-12 h-12 text-red-500 rounded-md"
      />
      <div className="text-sm font-medium text-gray-800">
        {state == "added"
          ? languageData.popUp.added[language]
          : languageData.popUp.removed[language]}
      </div>
    </div>
  );
}
