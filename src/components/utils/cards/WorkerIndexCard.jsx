import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { random } from "@/lib/utils";
import { validationImg } from "@/utils/validation";
import { useStore } from "@/store";
import languageBooking from "@/language/bookingDetails.json";
function WorkerIndexCard(theUser) {
  const router = useRouter();
  const { language, service, setService } = useStore();
  const [isImageAccessible, setIsImageAccessible] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    console.log("wena", theUser);
    setUser(theUser);
    console.log("user", user.user);
    // setUser(user.user);
  }, [user]);

  //go chat
  const goToChat = (subservice) => {
    const whatsappNumber = "+56933938608"; // Número del objeto booking
    const message =
      languageBooking.msgWhatsapp3[language] +
      " " +
      data.subService +
      " " +
      languageBooking.msgWhatsapp4[language]; // Mensaje opcional
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber.replace(
        /\D/g,
        ""
      )}?text=${encodedMessage}`,
      "_blank"
    );
  };

  function obtenerFechaYHora(isoString) {
    const [fecha, horaCompleta] = isoString.split("T");
    const hora = horaCompleta.slice(0, 5); // solo HH:mm
    return { fecha, hora };
  }
  const setFavorite = (id) => {
    localStorage.setItem("fromFavorite", true);

    const dataService = findServiceBySubServiceId(user.user, data.subServiceId);

    setService({
      duration: data.duration,
      price: 0,
      details: data.details,
      serviceId: dataService.serviceId,
      serviceName: dataService.serviceName,
      nameSubservice: data.subService,
      subServiceId: data.subServiceId,
      multiple: data.multiple,
      workerId: user.user._id,
    });
    if (data.goChat) {
      goToChat(data);
      setService({});
    } else if (dataService.serviceId == "67c11c4917c3a7a2c353cb1b") {
      let urlAmigable = encodeURIComponent(data.subService);

      const fechas = obtenerFechaYHora(data.isoTime);
      //minicambio2
      const url = `http://localhost:3000/summary-custom?date=${fechas.fecha}&workerId=65312a63c0b1e1658a5a712c&subServiceId=${data.subServiceId}&${data.isoTime}&stringData=${fechas.hora}&nameSubservice=${urlAmigable}&price=${data.price.category1}`;
      const urlSimple = `/summary-custom?date=${fechas.fecha}&workerId=65312a63c0b1e1658a5a712c&subServiceId=${data.subServiceId}&${data.isoTime}&stringData=${fechas.hora}&nameSubservice=${urlAmigable}&price=${data.price.category1}`;
      // router.push(urlSimple);
      window.location.href = url;
      return;
    } else {
      router.push("reservation/" + service.subServiceId);
      // router.push("/worker/" + id);
    }
  };
  useEffect(() => {
    const checkImage = async () => {
      const validImg = await validationImg(
        user?.user?.img?.imgUrl + "?hola=" + random()
      );
      setIsImageAccessible(validImg);
    };
    checkImage();
  }, [user?.user?.img?.imgUrl]);
  return (
    <div
      onClick={() => setFavorite(user?.user._id)}
      className="text-black flex flex-col bg-white mx-2   rounded-2xl border-r-2 border-blueBorder cursor-pointer "
    >
      <div className="w-full h-44 w-20 rounded-tr-2xl rounded-tl-2xl relative">
        <Image
          src={user?.user?.img?.imgUrl || "/assets/logoSOS.png"}
          fill
          alt="casa"
          className="object-cover rounded-tr-2xl rounded-tl-2xl"
        />
      </div>
      <div className="px-1 flex flex-col sm:px-2">
        <h1 className="font-semibold mt-2 text-sm">
          {user?.user?.personalData?.name?.first || ""}
        </h1>
        <h1 className="font-semibold text-sm">
          {user?.user?.personalData?.name?.last || ""}
        </h1>
        {/* <p className="text-blackText text-sm">
          {formatName(user?.user?.personalData?.name)}
        </p> */}
      </div>
    </div>
  );
}

export default WorkerIndexCard;
