let toastZIndexCounter = 1000;

import { useEffect, useState } from "react";
import languageData from "@/language/favorites.json";
import { useStore } from "@/store";

export default function FloatingFavoriteToast({
  visible,
  onClose,
  imgUrl,
  state,
}) {
  const { language } = useStore();

  const [show, setShow] = useState(false);
  const [zIndex, setZIndex] = useState(50);
  const [internalKey, setInternalKey] = useState(0);

  useEffect(() => {
    if (visible) {
      setInternalKey((prev) => prev + 1); // fuerza rerender visual
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      toastZIndexCounter += 1;
      setZIndex(toastZIndexCounter);
      // Aparece con delay pequeño para que aplique transición
      requestAnimationFrame(() => {
        setShow(true);
      });

      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [internalKey]);

  return (
    <div
      key={internalKey}
      style={{ zIndex }}
      className={`
        fixed bottom-16 left-1/2 transform -translate-x-1/2 
        w-64 px-4 py-3 border bg-white rounded-xl shadow-xl 
        flex items-center space-x-3
        transition-all duration-500 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${show ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      <img
        src={imgUrl}
        alt="Favorito"
        className="w-12 h-12 text-red-500 rounded-md"
      />
      <div className="text-sm font-medium text-gray-800">
        {state === "added"
          ? languageData.popUp.added[language]
          : languageData.popUp.removed[language]}
      </div>
    </div>
  );
}
