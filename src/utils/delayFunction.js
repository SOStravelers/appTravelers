export function delay(callback, ms = 250) {
  const timer = setTimeout(callback, ms);
  return () => clearTimeout(timer);
}

export const opacityAnimation =
  " transform transition-all duration-800 ease-out transition-opacity duration-800 ease-out opacity-0 scale-95 translate-y-4 pointer-events-none";
export const displayAnimation =
  "  transform transition-all duration-800 ease-out transition-opacity duration-800 ease-outopacity-100 scale-100 translate-y-0 pointer-events-auto";
