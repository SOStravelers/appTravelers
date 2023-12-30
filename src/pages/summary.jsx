import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import Link from "next/link";
import { ClockIcon, ChangeIcon, CheckIcon } from "@/constants/icons";

import HostelService from "@/services/HostelService";
import WorkerService from "@/services/WorkerService";
import SubserviceService from "@/services/SubserviceService";
import { is } from "date-fns/locale";

export default function Summary() {
  const { isWorker } = useStore();
  const router = useRouter();
  const { loggedIn, service, setService } = useStore();

  const [theHour, setHour] = useState(null);
  const [theDate, setDate] = useState(null);
  const [IdHostel, setIdHostel] = useState(null);
  const [worker, setWorker] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [subServiceId, setSubservice] = useState(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    document.title = "Summary | SOS Travelers";
    //localStorage.removeItem("fromFavorite");
    localStorage.removeItem("editing");
    getData();
  }, []);

  const getData = async () => {
    const { hostelId, hour, date, workerId, subServiceId } = service;
    setSubservice(subServiceId);

    if (!hostelId || !workerId) router.push("/");
    setIdHostel(hostelId);
    setHour(hour);
    setDate(date);

    HostelService.getBusiness(hostelId).then((response) => {
      // console.log("hostel", response.data);
      setHostel(response.data);
    });
    WorkerService.getWorker(workerId).then((response) => {
      // console.log("worker", response.data);
      setWorker(response.data);
    });
    SubserviceService.getPrice({
      businessUser: hostelId,
      subservice: subServiceId,
    }).then((response) => {
      // console.log("price", response.data);
      setService({ price: response.data.valuesToday, currency: "BRL" });
    });
  };

  const fullName = (data) => {
    if (!data) return "";
    const { first, last } = data;
    return first + " " + (last ?? "");
  };

  const hireNow = () => {
    localStorage.removeItem("editing");
    localStorage.removeItem("fromFavorite");
    if (!loggedIn) router.push("login");
    else router.push("/payment");
  };

  const validateEdit = () => {
    if (isWorker) return false;
    if (localStorage.getItem("fromFavorite")) return false;
  };

  function formatearFecha(fechaStr) {
    // Fecha proporcionada en formato YYYY-MM-DD
    var fechaObj = new Date(fechaStr);

    // Meses y días de la semana en inglés
    var meses = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var diasSemana = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Obtener el mes, día y año
    var mes = meses[fechaObj.getMonth()];
    var dia = fechaObj.getDate();
    var año = fechaObj.getFullYear();
    var diaSemana = diasSemana[fechaObj.getUTCDay()];

    // Formatear la fecha como "Wednesday, December 20, 2023"
    var fechaFormateada = diaSemana + ", " + mes + " " + dia + ", " + año;

    return fechaFormateada;
  }
  function getServiceNames(data) {
    // Extraer los nombres de los servicios
    const serviceNames = data.services.map((service) => service.id.name);

    // Unir los nombres en un solo string con comas
    const serviceNamesString = serviceNames.join(", ");

    return serviceNamesString;
  }
  return (
    <div className="flex flex-col items-center md:items-start py-20 lg:py-24 xl:py-24 px-6 md:pl-80">
      <h1 className="my-5 text-grey text-sm text-center max-w-lg">
        Read all the points carefully and make sure that it is what you need.
      </h1>
      <HostelCardSummary
        image={hostel?.img?.imgUrl}
        name={hostel?.businessData?.name}
        location={hostel?.businessData?.location?.city}
        link={`/hostel/${hostel?._id}`}
        subserviceId={subServiceId}
      />
      <hr className="w-full max-w-lg my-1 text-lightGrey" />
      <WorkerCardSumary
        name={fullName(worker?.personalData?.name)}
        service={
          worker?.workerData
            ? getServiceNames(worker.workerData)
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
            <p className="ml-2">{`${formatearFecha(service?.date) || ""} | ${
              service?.startTime?.stringData + " hrs" || ""
            }`}</p>
          </div>
          <Link className="flex " href={`/reservation/${IdHostel}`}>
            <ChangeIcon />
          </Link>
        </div>
      )}
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
          Accept our{" "}
          <Link href={"terms-of-service"} className="underline">
            Terms of Service &nbsp;
          </Link>
          and our{" "}
          <Link href={"use-policy"} className="underline">
            Use Policy.
          </Link>
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg mt-5 mb-2">
        <p className="text-blackText font-semibold">Service</p>
        <p className="text-blackBlue font-semibold text-md">
          {service?.nameSubservice}
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg my-1">
        <p className="text-blackText font-semibold">Service duration</p>
        <p className="text-blackBlue font-semibold text-md">
          {service?.duration} min
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg my-1">
        <p className="text-blackText font-semibold">Total Service Fee</p>
        <p className="text-blackBlue font-semibold text-xl">
          R$ {service?.price[0]?.finalCost}
        </p>
      </div>
      <OutlinedButton
        disabled={!selected}
        text={"Hire Now"}
        onClick={hireNow}
      />
    </div>
  );
}
