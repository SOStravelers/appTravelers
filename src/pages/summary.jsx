import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import SmallButton from "@/components/utils/buttons/SmallButton";
import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import Link from "next/link";
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
  const [hostel, setHostel] = useState(null);
  const [subServiceId, setSubservice] = useState(null);
  const [selected, setSelected] = useState(false);
  const [clients, setClients] = useState([]);
  const [price, setPrice] = useState();

  useEffect(() => {
    if (!service) {
      router.push("/");
      return;
    }
    document.title = "Summary | SOS Travelers";
    //localStorage.removeItem("fromFavorite");
    localStorage.removeItem("editing");
    getData();
  }, []);

  const getData = async () => {
    const { businessUser, hour, date, workerId, subServiceId } = service;
    setSubservice(subServiceId);
    if (!workerId) {
      console.log("va al fallo");
      setService({});
      router.push("/");
    }
    setIdHostel(businessUser);
    setHour(hour);
    setDate(date);

    if (!service.multiple) {
      console.log("al hostel");
      HostelService.getBusiness(businessUser).then((response) => {
        // console.log("hostel", response.data);
        setHostel(response.data);
      });
    } else {
      setHostel(null);
      setService({ businessUser: null });
    }
    WorkerService.getWorker(workerId).then((response) => {
      // console.log("worker", response.data);
      setWorker(response.data);
    });

    if (!service.multiple) {
      console.log("caso1");
      SubserviceService.getPrice({
        user: businessUser,
        subservice: subServiceId,
      }).then((response) => {
        setPrice(response.data.valuesToday[0].finalCost);
        setService({
          price: response.data.valuesToday,
          currency: "BRL",
          priceUnitService: response.data.valuesToday[0].finalCost,
        });
      });
    } else {
      console.log("caso2s");
      SubserviceService.getSubserviceByWorker({
        user: workerId,
        subservice: subServiceId,
      }).then((response) => {
        setPrice(response.data.prices.valuesToday[0].finalCost);
        setService({
          duration: response.data.duration,
          locationInfo: response.data.locationInfo,
          details: response.data.details,
          mapUrl: response.data.mapUrl,
          currency: "BRL",
          price: response.data.prices.valuesToday,
          priceUnitService: response.data.prices.valuesToday[0].finalCost,
        });
      });
    }

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
    if (!loggedIn && process.env.NEXT_PUBLIC_DEMO != "true")
      router.push("/login");
    else if (process.env.NEXT_PUBLIC_DEMO === "true")
      router.push("/payment-demo");
    else router.push("/payment");
  };

  const validateEdit = () => {
    if (isWorker) return false;
    if (localStorage.getItem("fromFavorite")) return false;
  };

  const addClient = (newClient) => {
    console.log("newClient", newClient);
    setClients((prevClients) => [...prevClients, newClient]);
  };

  useEffect(() => {
    console.log("wenino", service.price);
    if (service && service.price) {
      const updatedPrice = service.price.map((item) => ({
        ...item,
        finalCost: price * (clients.length + 1),
      }));

      setService({
        price: updatedPrice,
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

  return (
    <div className="flex flex-col items-center md:items-start py-20 lg:py-24 xl:py-24 px-6 md:pl-80">
      <h1 className="my-5 text-grey text-sm text-center max-w-lg">
        {languageData.read[language]}
      </h1>

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
            {service.multiple && service?.locationInfo
              ? service?.locationInfo[language]
              : service.businessUser
              ? hostel?.businessData?.location?.details["en"]
              : languageData.noDetails[language]}
          </p>
          <div className="mb-2 flex justify-center">
            <a href={service.mapUrl} target="_blank" rel="noopener noreferrer">
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
            ? getServiceNames(worker?.workerData)
            : "No services"
        }
        score={5}
        link={`/worker/${worker?._id}`}
        img={worker?.img?.imgUrl || "/assets/user.png"}
        showEdit={validateEdit()}
      />
      <hr className="w-full max-w-lg my-1 text-lightGrey" />

      {service && (
        <div className="flex justify-between w-full max-w-lg pr-1 my-5">
          <div className="flex  ">
            <ClockIcon />
            <p className="ml-2">{`${
              formatearFecha(service?.date, language) || ""
            } | ${service?.startTime?.stringData + " hrs" || ""}`}</p>
          </div>
          <Link className="flex " href={`/reservation/${IdHostel}`}>
            <ChangeIcon />
          </Link>
        </div>
      )}

      <div className="w-full max-w-lg">
        <div
          className="grid grid-cols-5 gap-4 items-center cursor-pointer"
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
            isTextVisible2 ? "max-h-screen" : "max-h-0"
          }`}
        >
          <p className="mb-2">{service?.details?.[language] ?? ""}</p>
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
          R$ {service?.price ? service?.price[0]?.finalCost : 0}
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
