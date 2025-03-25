import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { random } from "@/lib/utils";
import { validationImg } from "@/utils/validation";
import { useStore } from "@/store";
import languageBooking from "@/language/bookingDetails.json";
function RecomendationCard(user) {
  const router = useRouter();
  const { language, service, setService } = useStore();
  const [isImageAccessible, setIsImageAccessible] = useState(false);
  const [data, setData] = useState({ subService: "", imgUrl: "" });
  useEffect(() => {
    getRandomSubServiceName(user.user);
  }, []);
  function getRandomSubServiceName(user) {
    const allSubServices = user.workerData.services.flatMap(
      (service) => service.subServices
    );

    // Si no hay subServices, devuelve null
    if (allSubServices.length === 0) {
      setData({
        subService: null,
        serviceId: null,
        imgUrl: user?.imgUrl + "?hola=" + random(),
        subServiceId: null,
        duration: null,
        details: null,
        multiple: null,
      });
    }

    // Obtén un índice aleatorio
    const randomIndex = Math.floor(Math.random() * allSubServices.length);

    // Devuelve el nombre del subService en el índice aleatorio
    setData({
      subService: allSubServices[randomIndex].name[language],
      subServiceId: allSubServices[randomIndex]._id,
      duration: allSubServices[randomIndex].duration,
      goChat: allSubServices[randomIndex].goChat,
      price: allSubServices[randomIndex].price,
      isoTime: allSubServices[randomIndex].isoTime,
      details: allSubServices[randomIndex].details,
      multiple: allSubServices[randomIndex].multiple,
      imgUrl: allSubServices[randomIndex]?.imgUrl + "?hola=" + random(),
    });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const formatName = (name) => {
    const first = name?.first
      ? name?.first.charAt(0).toUpperCase() + name?.first?.slice(1)
      : "";
    const last = name?.last
      ? name?.last?.charAt(0).toUpperCase() + name?.last?.slice(1)
      : "";
    return first + " " + last;
  };

  const findServiceBySubServiceId = (user, subServiceId) => {
    for (const service of user.workerData.services) {
      const matchingSubService = service.subServices.find(
        (subService) => subService._id === subServiceId
      );
      if (matchingSubService) {
        return {
          serviceId: service.id ? service.id._id : null,
          serviceName: service.id ? service.id.name : null,
        };
      }
    }
    return null; // Si no se encuentra el subServiceId
  };
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
      const url = `https://sostvl.com/summary-custom?date=${fechas.fecha}&workerId=65312a63c0b1e1658a5a712c&subServiceId=${data.subServiceId}&${data.isoTime}&stringData=${fechas.hora}&nameSubservice=${urlAmigable}&price=${data.price.category1}`;
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
      <div className="w-full h-28 w-20 rounded-tr-2xl rounded-tl-2xl relative">
        <Image
          src={data?.imgUrl || "/assets/logoSOS.png"}
          fill
          alt="casa"
          className="object-cover rounded-tr-2xl rounded-tl-2xl"
        />
      </div>
      <div className="px-1 flex flex-col sm:px-2">
        <h1 className="font-semibold mt-2 text-sm">{data.subService}</h1>
        <h1 className="font-semibold  ">
          {languageBooking.from[language]} R$ {data?.price?.category1 || ""}
        </h1>
        {/* <p className="text-blackText text-sm">
          {formatName(user?.user?.personalData?.name)}
        </p> */}
      </div>
    </div>
  );
}

export default RecomendationCard;
