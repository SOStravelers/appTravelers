import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";

import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import SmallButton from "@/components/utils/buttons/SmallButton";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import OutlinedInputPhone from "@/components/utils/inputs/OutlinedInputPhone";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import {
  ClockIcon,
  MailIcon,
  ChangeIcon,
  CheckIcon,
  PlusIcon,
  ArrowUpIcon,
  MinusIcon,
  UserIcon,
} from "@/constants/icons";
import { fullName, getServiceNames, formatearFecha } from "@/utils/format";
import HostelService from "@/services/HostelService";
import WorkerService from "@/services/WorkerService";
import SubserviceService from "@/services/SubserviceService";
import languageData from "@/language/summary.json";
import languageDataLogin from "@/language/login.json";

export default function Summary() {
  const { isWorker, language } = useStore();
  const router = useRouter();
  const { loggedIn, service, setService } = useStore();
  const [isTextVisible1, setIsTextVisible1] = useState(false);
  const [isTextVisible2, setIsTextVisible2] = useState(false);
  const [theHour, setHour] = useState(null);
  const [theDate, setDate] = useState(null);
  const [IdHostel, setIdHostel] = useState(null);
  const [worker, setWorker] = useState(null);
  const [workerId, setWorkeId] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [subServiceId, setSubservice] = useState(null);
  const [selected, setSelected] = useState(false);
  const [clients, setClients] = useState([]);
  const [price, setPrice] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    document.title = "Summary | SOS Travelers";
    //localStorage.removeItem("fromFavorite");
    localStorage.removeItem("editing");
    getData();
  }, []);

  const getData = async () => {
    const {
      isoTime,
      stringData,
      nameSubservice,
      nameService,
      date,
      workerId,
      subServiceId,
      price,
      duration,
    } = router.query;

    const startTime = {
      isoTime: isoTime,
      stringData: stringData,
    };
    console.log("workerId", workerId);
    //hola
    // const date = "2025-03-15";
    // const workerId = "67577f826779bb536c96fa10";
    // const subServiceId = "675753add2b2668720116ed4";
    // const startTime = {
    //   isoTime: "2025-03-15T16:43:00.000Z",
    //   stringData: "16:43",
    // };
    // const nameService = "Paseos";
    // const nameSubservice = "Angra dos reis";

    // date=2025-03-15&workerId=67577f826779bb536c96fa10&subServiceId=675753add2b2668720116ed4&isoTime=2025-03-15T16:43:00.000Z&stringData=16:43&nameService=Paseos&nameSubservice=Angra%20dos%20reis&price=3
    setSubservice(subServiceId);
    if (!workerId) {
      console.log("va al fallo");
      setService({});
      router.push("/");
      return;
    }
    setIdHostel(null);
    setDate(date);
    setHostel(null);
    setService({ businessUser: null });
    console.log("va a buscar el worker", workerId);
    WorkerService.getWorker(workerId).then((response) => {
      console.log("workerListo", response.data);
      setWorker(response.data);
    });
    console.log("caso2s");
    SubserviceService.getSubserviceByWorker(
      {
        user: workerId,
        subservice: subServiceId,
        onlySubservice: true,
      },
      true
    ).then((response) => {
      console.log("la dataaas", response.data);
      setPrice(price);
      setService({
        duration: duration || response.data.duration,
        date: date,
        nameSubservice: nameSubservice,
        nameService: nameService,
        imgUrl: response.data.imgUrl,
        startTime: startTime,
        phoneNumber: "",
        locationInfo: response.data.locationInfo,
        serviceId: response.data.service,
        subServiceId: subServiceId,
        details: response.data.details,
        mapUrl: response.data.mapUrl,
        workerId: workerId,
        currency: "BRL",
        price: [{ currency: "BRL", value: 1, aprox: 1, finalCost: price }],
        priceUnitService: price,
        multiple: true,
      });
    });

    setService({ language: language });
  };

  const toggleText1 = () => {
    setIsTextVisible1(!isTextVisible1);
  };
  const toggleText2 = () => {
    setIsTextVisible2(!isTextVisible2);
  };

  const hireNow = () => {
    localStorage.removeItem("editing");
    localStorage.removeItem("fromFavorite");
    if (!loggedIn && process.env.NEXT_PUBLIC_DEMO != "true") {
      localStorage.setItem("fromCustomSummary", true);
      const fullUrl = window.location.href;
      localStorage.setItem("fullUrl", fullUrl);
      router.push("/login");
    } else {
      console.log("phone number", service.phoneNumber);
      const number = service.phoneNumber.split(" ")[1];
      console.log("el number", number);
      if (number.length < 8 || number.length > 15) {
        toast.error("Not Valid number");
      } else {
        router.push("/payment");
      }
    }
  };

  const validateEdit = () => {
    if (isWorker) return false;
    if (localStorage.getItem("fromFavorite")) return false;
  };

  const setTheNumber = (value) => {
    setPhoneNumber(value);
    setService({
      phoneNumber: value,
    });
  };

  const addClient = (newClient) => {
    console.log("newClient", newClient);
    setClients((prevClients) => [...prevClients, newClient]);
  };

  useEffect(() => {
    if (service && service?.price) {
      const newValue = service.priceUnitService * (clients.length + 1);
      setService({
        price: [{ currency: "BRL", value: 1, aprox: 1, finalCost: newValue }],
        currency: "BRL",
        clientsNumber: clients.length + 1,
        clients: clients,
      });
    }
  }, [clients]);

  const handleInputChange = (index, value) => {
    const updatedClients = [...clients];
    updatedClients[index].name = value; // Actualiza el valor del cliente correspondiente
    setClients(updatedClients);
  };
  const handleRemoveClient = (indexToRemove) => {
    setClients((prevClients) =>
      prevClients.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    console.log("wewadsa");
    if (worker?.img?.imgUrl) {
      setImage(worker.img.imgUrl);
    }
  }, [worker]);

  const setImage = (img) => {
    if (img) {
      return `${img}?${new Date().getTime()}`; // Agrega un timestamp único
    } else {
      return "/assets/user.png";
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start py-20 lg:py-24 xl:py-24 px-6 md:pl-80">
      <h1 className="my-5 text-grey text-sm text-center max-w-lg">
        {languageData.read[language]}
      </h1>
      <div className="font-bold">{service.nameSubservice}</div>
      <div className="w-full max-w-lg h-28 mt-5 rounded-xl bg-blueBorder relative">
        {service?.imgUrl && (
          <Image
            src={service?.imgUrl}
            fill
            alt="imagenCover"
            className="object-cover rounded-xl"
          />
        )}
      </div>

      {hostel && (
        <HostelCardSummary
          image={hostel?.img?.imgUrl}
          name={hostel?.businessData?.name}
          location={hostel?.businessData?.location?.city}
          link={`/hostel/${hostel?._id}`}
          linkSummary={`/select-hostel/${subServiceId}`}
          subserviceId={subServiceId}
        />
      )}
      {/* Desplegable info hostel */}

      <div className="w-full max-w-lg">
        <div
          className="grid grid-cols-5 gap-4 items-center cursor-pointer"
          onClick={toggleText1}
        >
          <div className="col-span-4 text-left text-sm py-2 my-5">
            <h1 className=" text-blackText font-semibold">
              {languageData.location[language]}
            </h1>
          </div>
          <div className="col-span-1 flex justify-end">
            <ArrowUpIcon
              color={"#00A0D5"}
              className={`${isTextVisible1 ? "rotate-180" : "rotate-90"} `}
            />
          </div>
        </div>
        <div
          style={{ marginLeft: "-2px" }}
          className={`overflow-hidden mx-10 transition-all duration-500 ease-in-out ${
            isTextVisible1 ? "max-h-screen" : "max-h-0"
          }`}
        >
          <p className=" mb-2">
            {service?.multiple && service?.locationInfo
              ? service?.locationInfo[language]
              : service?.businessUser
              ? hostel?.businessData?.location?.details["en"]
              : languageData.noDetails[language]}
          </p>
          <div className="mb-2 flex justify-center">
            <a href={service?.mapUrl} target="_blank" rel="noopener noreferrer">
              <SmallButton text={languageData.seeMap[language]} />
            </a>
          </div>
        </div>
      </div>
      <hr className="w-full max-w-lg my-1 text-lightGrey" />
      <h1 className="mt-2 text-grey text-sm text-center max-w-lg">Partner</h1>
      <WorkerCardSumary
        name={fullName(worker?.personalData?.name)}
        service={
          worker?.workerData
            ? getServiceNames(worker?.workerData, language)
            : "No services"
        }
        score={5}
        link={`/worker/${worker?._id}`}
        img={setImage(worker?.img?.imgUrl)} // Aquí se usa la función
        showEdit={validateEdit()}
      />
      <hr className="w-full max-w-lg my-1 text-lightGrey" />

      {service && (
        <div className="flex justify-between w-full max-w-lg pr-1 my-5">
          <div className="flex">
            <ClockIcon />
            {service?.date && (
              <p className="ml-2">{`${formatearFecha(
                service?.date,
                language
              )} | ${service?.startTime?.stringData + " hrs" || ""}`}</p>
            )}
          </div>
          {/* <Link className="flex" href={`/reservation/${IdHostel}`}>
            <ChangeIcon />
          </Link> */}
        </div>
      )}

      <div className="w-full max-w-lg">
        <div
          className="grid grid-cols-5 gap-4 items-center cursor-pointer sticky top-[50px] bg-white z-10"
          onClick={toggleText2}
        >
          <div className="col-span-4 text-left text-sm py-2 my-5">
            <h1 className=" text-blackText font-semibold">
              {languageData.descriptionService[language]}
            </h1>
          </div>
          <div className="col-span-1 flex justify-end">
            <ArrowUpIcon
              color={"#00A0D5"}
              className={`${isTextVisible2 ? "rotate-180" : "rotate-90"} `}
            />
          </div>
        </div>

        <div
          style={{ marginLeft: "-2px" }}
          className={`overflow-hidden mx-10 transition-all duration-500 ease-in-out ${
            isTextVisible2 ? "max-h-auto" : "max-h-0"
          }`}
        >
          <div
            className="mb-2 ml-1 text-left"
            dangerouslySetInnerHTML={{
              __html: service?.details?.[language] ?? "",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col w-full max-w-lg my-2">
        {clients.length > 0 &&
          clients.map((item, index) => (
            <div
              key={index}
              className="flex items-center w-full gap-2" // Espacio entre elementos ajustado con `gap-2`
            >
              <OutlinedInput
                placeholder={languageData.textInput[language]}
                value={item.name}
                icon={UserIcon}
                onChange={(e) => handleInputChange(index, e.target.value)}
                type="email"
                width="90%" // Define el ancho personalizado aquí
              />
              <button
                onClick={() => handleRemoveClient(index)} // Maneja la acción del botón
                className="text-red-500 hover:text-red-700  flex items-center justify-center ml-2"
              >
                <MinusIcon className="h-6 w-6 stroke-2" />{" "}
                {/* Ícono más grueso */}
              </button>
            </div>
          ))}
      </div>
      <hr className="w-full max-w-lg my-1 text-lightGrey" />
      <h1 className="my-2 text-grey text-sm text-center max-w-lg">
        Contact Number
      </h1>
      <OutlinedInputPhone
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(value) => setTheNumber(value)}
        type="phone"
        width="90%"
      />
      <hr className="w-full max-w-lg my-6 text-lightGrey" />
      <h1 className="my-4 text-grey text-sm text-center max-w-lg">
        {languageData.textAdd[language]}
      </h1>
      <div
        className="mb-2 flex justify-center"
        onClick={() => addClient({ name: "" })}
      >
        <SmallButton text={languageData.buttonClient[language]} />
      </div>

      <div className="flex items-center w-full max-w-lg my-2">
        {selected ? (
          <CheckIcon
            className="mr-2 w-6 h-6 cursor-pointer"
            onClick={() => setSelected(false)}
          />
        ) : (
          <input
            type="checkbox"
            className="mr-2 w-6 h-6"
            checked={selected}
            onChange={() => setSelected(!selected)}
          />
        )}

        <p className="text-greyText">
          {languageData.acceptOur[language]}{" "}
          <Link href={"terms-of-service"} className="underline">
            {languageDataLogin.login.terms[language]} &nbsp;
          </Link>
          {languageDataLogin.login.our[language]}{" "}
          <Link href={"use-policy"} className="underline">
            {languageDataLogin.login.policy[language]}.
          </Link>
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg mt-5 mb-2">
        <p className="text-blackText font-semibold">
          {languageData.service[language]}
        </p>
        <p className="text-blackBlue font-semibold text-md">
          {service?.nameSubservice}
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg my-1">
        <p className="text-blackText font-semibold">
          {languageData.durationService[language]}
        </p>
        <p className="text-blackBlue font-semibold text-md">
          {service?.duration > 120
            ? `${(service?.duration / 60).toFixed(1)} hr${
                service?.duration >= 180 ? "s" : ""
              }`
            : `${service?.duration} min`}
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg my-1">
        <p className="text-blackText font-semibold">
          {languageData.totalUser[language]}
        </p>
        <p className="text-blackBlue font-semibold text-xl">R$ {price}</p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg my-1">
        <p className="text-blackText font-semibold">
          {languageData.totalService[language]}
        </p>
        <p className="text-blackBlue font-semibold text-xl">
          R$ {service?.price ? service?.price[0]?.finalCost : price}
        </p>
      </div>
      <OutlinedButton
        disabled={!selected}
        text={languageData.bookNow[language]}
        onClick={hireNow}
      />
    </div>
  );
}
