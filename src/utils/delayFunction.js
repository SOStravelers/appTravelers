export function delay(callback, ms = 300) {
  const timer = setTimeout(callback, ms);
  return () => clearTimeout(timer);
}

export const opacityAnimation =
  "opacity-0 pointer-events-none transition-opacity duration-1000 ease-out";

export const displayAnimation =
  "opacity-100 pointer-events-auto transition-opacity duration-1000 ease-out";
