import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import SmallButton from "@/components/utils/buttons/SmallButton";
import Link from "next/link";
import {
  ClockIcon,
  ChangeIcon,
  CheckIcon,
  ArrowUpIcon,
} from "@/constants/icons";
import { fullName, getServiceNames, formatearFecha } from "@/utils/format";
import HostelService from "@/services/HostelService";
import WorkerService from "@/services/WorkerService";
import SubserviceService from "@/services/SubserviceService";

export default function Summary() {
  const { isWorker } = useStore();
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
    const { hostelId, hour, date, workerId, subServiceId } = service;
    setSubservice(subServiceId);
    console.log("aa");
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
        linkSummary={`/select-hostel/${subServiceId}`}
        subserviceId={subServiceId}
      />
      {/* Desplegable info hostel */}

      <div className="w-full max-w-lg">
        <div
          className="grid grid-cols-5 gap-4 items-center cursor-pointer"
          onClick={toggleText1}
        >
          <div className="col-span-4 text-left text-sm py-2 my-5">
            <h1 className=" text-blackText font-semibold">
              {isWorker ? "Informações de localização" : "Location information"}
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
            {isWorker
              ? hostel?.businessData?.location?.details["pt"]
              : hostel?.businessData?.location?.details["en"]}
          </p>
          <div className="mb-2 flex justify-center">
            <a
              href={hostel?.businessData?.location?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SmallButton text={isWorker ? "Veja no mapa" : "See on map"} />
            </a>
          </div>
        </div>
      </div>
      <hr className="w-full max-w-lg my-1 text-lightGrey" />
      <h1 className="mt-2 text-grey text-sm text-center max-w-lg">
        Professional
      </h1>
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
              formatearFecha(service?.date, false) || ""
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
              {isWorker ? "Descrição do Serviço" : "Service description"}
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
          <p className=" mb-2">
            {isWorker ? service.details["pt"] : service.details["en"]}
          </p>
        </div>
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
        disabled={!selected && !service?.price[0]?.finalCost}
        text={"Book Now"}
        onClick={hireNow}
      />
    </div>
  );
}
