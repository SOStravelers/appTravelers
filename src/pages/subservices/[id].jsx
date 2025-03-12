import { useEffect, useState } from "react";
import WorkerCard from "@/components/utils/cards/WorkerCard";
import { useRouter } from "next/router";
import { QuestionPicture } from "@/constants/icons";
import SubServiceCard from "@/components/utils/cards/SubServiceCard";
import SubserviceService from "@/services/SubserviceService";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";
import languageData from "@/language/subServices.json";
import languageBooking from "@/language/bookingDetails.json";
export default function Subservices() {
  const { language, service, setService } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subServices, setSubservices] = useState([]);

  const idPaseos = "6757137ad2b2668720116ec9";
  //minicambio
  useEffect(() => {
    document.title = "Choose subservice | SOS Travelers";
    const fromFavorite = localStorage.getItem("fromFavorite");
    if (fromFavorite === true) {
      getDataFav();
    } else {
      getData();
    }
  }, []);

  const getData = async () => {
    const id = router.query.id;
    SubserviceService.list({ id: id }).then((response) => {
      setSubservices(response.data.docs);
      setLoading(false);
    });
  };
  console.log("los", subServices);
  const getDataFav = async () => {
    const subServices = JSON.parse(router.query.subservices);
    setSubservices(subServices);
    setLoading(false);
  };

  const goToChat = (subservice) => {
    const whatsappNumber = "+56933938608"; // Número del objeto booking
    const message =
      languageBooking.msgWhatsapp3[language] +
      " " +
      service.serviceName +
      " - " +
      subservice.name[language] +
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
  //minicambio
  const selectSubservice = (miniService) => {
    console.log("erno", miniService);
    console.log("service", service);

    if (service.serviceId == "67c11c4917c3a7a2c353cb1b") {
      let urlAmigable = encodeURIComponent(miniService.name[language]);
      //minicambio
      const url = `https://sostvl.com/summary-custom?date=2025-03-12&workerId=65312a63c0b1e1658a5a712c&subServiceId=${miniService._id}&isoTime=2025-03-12T21:30:00.000Z&stringData=21:30&nameSubservice=${urlAmigable}&price=${miniService.price.category1}`;
      const urlSimple = `/summary-custom?date=2025-03-12&workerId=65312a63c0b1e1658a5a712c&subServiceId=${miniService._id}&isoTime=2025-03-12T21:30:00.000Z&stringData=21:30&nameSubservice=${urlAmigable}&price=${miniService.price.category1}`;
      // router.push(urlSimple);
      window.location.href = url;
      return;
    } else if (miniService.goChat) {
      goToChat(miniService);
      return;
    } else {
      setService({
        subServiceId: miniService._id,
        nameSubservice: miniService.name[language],
        duration: miniService.duration,
        details: miniService.details,
        multiple: miniService.multiple,
        ...(miniService.multiple === false && { price: miniService.price }), // Condicionalmente incluye `price`
      });
    }
  };
  //minicambio
  return (
    <div className="mt-4 p-10 pb-20 flex  flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-2 font-semibold mt-1 text-center max-w-lg">
        {service.serviceName + " " + languageData.title[language]}
      </h1>
      {service.serviceId == idPaseos && (
        <p className="mt-2">{languageData.partner[language]}</p>
      )}
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : subServices && subServices.length > 0 ? (
        // <div className="flex max-w-lg flex-wrap">
        //   {subServices?.map((s, index) => (
        //     <div className="w-1/2" key={index}>
        //       {s.multiple}
        //       <SubServiceCard
        //         id={s._id}
        //         duration={s.duration}
        //         details={s.details}
        //         price={s.price}
        //         link={
        //           s.multiple ? `/reservation/${s.id}` : `/select-hostel/${s.id}`
        //         }
        //         name={s.name}
        //         img={s.imgUrl}
        //         multiple={s.multiple}
        //       />
        //     </div>
        //   ))}
        // </div>
        //hola
        <div className="flex flex-col items-center">
          {subServices.map((s, index) => (
            <div className="w-full" key={index}>
              <WorkerCard
                key={index}
                id={s._id}
                name={s?.name[language] || ""}
                isSubservice={true}
                service={s?.shortDescription[language] || ""}
                serviceName={s?.name[language] || ""}
                subServiceId={s._id}
                onClickSummary={() => {
                  selectSubservice(s);
                }}
                duration={s.duration}
                details={s.details}
                price={s.price}
                score={5}
                img={s.imgUrl || "/assets/user.png"}
                multiple={true}
                link={
                  service.goChat
                    ? ""
                    : s.multiple
                    ? `/reservation/${s.id}`
                    : `/select-hostel/${s.id}`
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center text-greyText max-w-lg mt-6  lg:my-4 xl:my-4 mb-2">
            No services available
          </p>
          <QuestionPicture />
        </div>
      )}
    </div>
  );
}
