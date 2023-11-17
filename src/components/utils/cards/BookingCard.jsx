import { mazzard } from "@/utils/mazzardFont";
import { PinIcon, ClockIcon } from "@/constants/icons";

function BookingCard({ direction, date }) {
  function generarTextoAleatorio() {
    const palabras = [
      "Manzana",
      "Banana",
      "Perro",
      "Gato",
      "Montaña",
      "Playa",
      "Sol",
      "Luna",
      "Feliz",
      "Triste",
      "Rápido",
      "Lento",
      "Rojo",
      "Azul",
      "Verde",
      "Cielo",
      "Mar",
      "Árbol",
      "Libro",
      "Casa",
    ];

    // Selecciona tres palabras al azar
    const palabra1 = palabras[Math.floor(Math.random() * palabras.length)];
    const palabra2 = palabras[Math.floor(Math.random() * palabras.length)];
    const palabra3 = palabras[Math.floor(Math.random() * palabras.length)];

    // Forma la frase con las palabras seleccionadas
    const textoAleatorio = `${palabra1} ${palabra2} ${palabra3}`;

    return textoAleatorio;
  }

  // Ejemplo de uso
  const textoRandom = generarTextoAleatorio();
  return (
    <div className="text-black py-5 mb-10 w-full mx-auto flex flex-col justify-center border-b border-blueBorder bg-white rounded-2xl">
      <div className="bg-blueBorder w-full px-3 py-1 rounded-t-2xl">
        <h1
          className={`text-white rounded-r-2xl rounded-2xl font-semibold ${mazzard.className}`}
          style={{ backgroundClip: "padding-box" }}
        >
          {textoRandom}
        </h1>
      </div>
      <div className="flex flex-col justify-between px-3 mt-5">
        <div className="flex items-center mb-2">
          <PinIcon color={"#00A0D5"} className="mr-2" />
          <p className="text-blackText">{direction}</p>
        </div>
        <div className="flex items-center">
          <ClockIcon color={"#00A0D5"} className="mr-2" />
          <p className="text-blackText">{date}</p>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;
