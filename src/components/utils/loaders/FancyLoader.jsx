import { useEffect, useState } from "react";

export default function FancyLoader({ messages = ["Cargando..."] }) {
  const [index, setIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [fade, setFade] = useState(true);

  // Cambiar frase cada 2.5s con animación suave
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // ocultar
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setFade(true); // volver a mostrar
      }, 250); // animación fade-out antes del cambio
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Animar los puntos
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-backgroundP z-10">
      {/* Spinner con glow */}
      <div className="relative">
        <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-tr from-textColor to-transparent blur-xl opacity-30 animate-spin-slow"></div>
        <div className="w-12 h-12 border-4 border-t-transparent border-textColor rounded-full animate-spin relative z-10"></div>
      </div>

      {/* Frase animada con fade */}
      <div
        key={index}
        className={`mt-6 text-textColorGray text-lg font-medium tracking-wide text-center transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages[index]}
        <span className="inline-block animate-pulse ml-1">{dots}</span>
      </div>
    </div>
  );
}
