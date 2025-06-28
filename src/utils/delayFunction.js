export default function delay(ms = 500, callback) {
  const timer = setTimeout(() => {
    if (callback) callback();
  }, ms);

  // Devuelve una función para cancelar si lo necesitas
  return () => clearTimeout(timer);
}
