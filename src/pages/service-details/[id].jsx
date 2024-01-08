import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import WorkerProfileCardDetails from "@/components/utils/cards/WorkerProfileCardDetails";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedChatButton from "@/components/utils/buttons/OutlinedChatButton";
import ChatService from "@/services/ChatService";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import { PinIcon, ClockIcon, CircleCheckIcon } from "@/constants/icons";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import { Rings } from "react-loader-spinner";

function ServiceHistory() {
  const router = useRouter();
  const { isWorker, user } = useStore();
  const [booking, setBooking] = useState(null);
  const [typeUser, setTypeUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = "Service Details | SOS Travelers";
  }, []);

  useEffect(() => {
    getBooking();
  }, []);

  const getBooking = async () => {
    try {
      console.log("asdadasfsfsdf");
      const id = router.query.id;
      const response = await BookingService.getBookingById(id);
      const booking = response.data;
      setBooking(booking);
      if (user._id === booking.workerUser._id && isWorker) {
        console.log("worker");
        setTypeUser("worker");
      } else if (user._id === booking.clientUser._id) {
        console.log("client");
        setTypeUser("client");
      } else if (user._id != booking.workerUser._id && isWorker) {
        console.log("externalWorker");
        setTypeUser("externalWorker");
      } else {
        router.push("/");
      }

      console.log("booking", response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const goToChat = () => {
    ChatService.createChatRoom({
      booking: booking?._id,
      user: isWorker ? booking?.clientUser?._id : booking?.workerUser?._id,
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        router.push({
          pathname: isWorker
            ? `/worker/chat/${res.data._id}`
            : `/chat/${res.data._id}`,
          query: {
            name: booking?.workerUser?.personalData?.name,
            avatar: booking?.workerUser?.img?.imgUrl || "/assets/proovedor.png",
            service: booking?.service?.name,
            date: booking?.date?.stringData,
            hour: booking?.startTime?.stringData,
            idWorker: booking?.workerUser?._id,
            businessName: booking?.businessUser?.businessData?.name,
            location: booking?.businessUser?.businessData?.location?.city,
            subService: booking?.subservice?.name,
            idBooking: booking?._id,
            idClient: booking?.clientUser?._id,
          },
        });
      }
    });
    /*router.push({
      pathname: `/chat/${idWorker}`,
      query: {
        name: name,
        avatar: avatar?.length === 0 ? "/assets/proovedor.png" : avatar,
        service: service,
        date: date,
        hour: hour,
        idWorker: idWorker,
        businessName: businessName,
        location: location,
        subService: subService,
        idBooking: idBooking,
      },
    });
    */
  };
  const fullName = (data) => {
    if (!data) return "";
    const { first, last } = data;
    return first + " " + (last ?? "");
  };
  function formatearFecha(fechaStr, isWorker) {
    console.log("la fecha", fechaStr);
    var [año, mes, dia] = fechaStr.split("-").map(Number);

    // Crear un nuevo objeto Date en el huso horario local
    var fechaObj = new Date(año, mes - 1, dia);

    // Meses y días de la semana en inglés
    var mesesIngles = [
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
    var diasSemanaIngles = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Meses y días de la semana en portugués
    var mesesPortugues = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    var diasSemanaPortugues = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    // Seleccionar los meses y días de la semana correctos
    var meses = isWorker ? mesesPortugues : mesesIngles;
    var diasSemana = isWorker ? diasSemanaPortugues : diasSemanaIngles;

    // Obtener el mes, día y año
    var mes = meses[fechaObj.getMonth()];
    var dia = fechaObj.getDate();
    var año = fechaObj.getFullYear();
    var diaSemana = diasSemana[fechaObj.getUTCDay()];

    // Formatear la fecha como "Wednesday, December 20, 2023" o "Quarta-feira, Dezembro 20, 2023"
    var fechaFormateada = diaSemana + ", " + mes + " " + dia + ", " + año;

    return fechaFormateada;
  }
  function StatusChip({ status }) {
    let color;
    let textColor = "white"; // Define textColor here
    let statusPortugues = status;
    switch (status) {
      case "requested":
        color = "grey";
        statusPortugues = "Solicitado";
        break;
      case "completed":
        color = "green";
        statusPortugues = "Completado";
        break;
      case "canceled":
        color = "#e77b7b";
        statusPortugues = "Cancelado";
        break;
      case "confirmed":
        color = "#92ef72";
        textColor = "black";
        statusPortugues = "Confirmado";
        break;
      default:
        color = "gray";
    }

    const style = {
      display: "inline-block",
      padding: "0.3rem 0.8rem",
      position: "relative",
      transform: "translateY(-2px)",
      borderRadius: "9999px",
      fontSize: "0.85rem",
      fontWeight: "550",
      color: textColor,
      backgroundColor: color,
    };

    return <span style={style}>{isWorker ? statusPortugues : status}</span>;
  }

  return (
    //p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80 md:items-start
    <div className="p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-6 md:pl-80">
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p>Searching...</p>
        </div>
      ) : (
        <>
          <div className="font-semibold text-center max-w-lg mt-2 lg:my-4 xl:my-4 mb-2">
            {isWorker ? "Local de serviço" : "Location Service"}
          </div>
          <HostelCardSummary
            image={booking?.businessUser?.img?.imgUrl}
            name={booking?.businessUser?.businessData?.name}
            location={booking?.businessUser?.businessData?.location?.city}
            link={`/hostel/${booking?.businessUser?._id}`}
            subserviceId={booking?.subservice?._id}
            go={false}
          />
          <hr className="w-full max-w-lg text-grey" />
          <div className="mt-2 flex justify-center max-w-lg">
            <p className="text-left font-semibold">
              {isWorker ? "Meu cliente" : "My Profesional"}
            </p>
          </div>
          {typeUser != "externalWorker" && (
            <>
              <WorkerCardSumary
                name={
                  !isWorker
                    ? fullName(booking?.workerUser?.personalData?.name)
                    : fullName(booking?.clientUser?.personalData?.name)
                }
                score={5}
                link={`/worker/${booking?.workerUser?._id}`}
                img={
                  !isWorker
                    ? booking?.workerUser?.img?.imgUrl || "/assets/user.png"
                    : booking?.clientUser?.img?.imgUrl || "/assets/user.png"
                }
                showEdit={false}
                service={
                  booking?.service?.name && !isWorker
                    ? booking?.service?.name
                    : ""
                }
              />
              <div className="flex flex-col items-center justify-center max-w-lg">
                {booking?.status != "canceled" &&
                  booking?.status != "completed" &&
                  booking?.status != "requested" && (
                    <OutlinedChatButton
                      text="Chat Now"
                      onClick={() => goToChat()}
                    />
                  )}
                <hr className="w-full mt-4 max-w-lg  text-grey" />
              </div>
            </>
          )}
          <div className="flex justify-between w-full max-w-lg pr-1 my-5">
            <div className="flex flex-row">
              <div className="flex justify-center items-center h-full">
                <ClockIcon />
              </div>
              <div>
                <p className="ml-2">{`${
                  booking?.date?.stringData
                    ? formatearFecha(booking?.date?.stringData, isWorker)
                    : ""
                } `}</p>
                <p className="ml-2">{`${
                  booking?.startTime?.stringData + " hrs" || ""
                }`}</p>
              </div>
            </div>
          </div>
          <hr className="w-full max-w-lg  text-grey" />
          <div className="flex justify-between items-center w-full max-w-lg mt-4 mb-2">
            <p className="text-blackText font-semibold text-lg">Status</p>
            <p className="text-blackBlue font-semibold text-md">
              <StatusChip status={booking?.status} />
            </p>
          </div>
          <hr className="w-full max-w-lg  text-grey" />
          <div className="flex justify-between items-end w-full max-w-lg mt-5 mb-2">
            <p className="text-blackText font-semibold">
              {isWorker ? "Serviço" : "Service"}
            </p>
            <p className="text-blackBlue font-semibold text-md">
              {booking?.subservice?.name}
            </p>
          </div>
          <div className="flex justify-between items-end w-full max-w-lg my-1">
            <p className="text-blackText font-semibold">
              {isWorker ? "Duração do serviço" : "Service duration"}
            </p>
            <p className="text-blackBlue font-semibold text-md">
              {booking?.duration} min
            </p>
          </div>
          <div className="flex justify-between items-end w-full max-w-lg my-1">
            <p className="text-blackText font-semibold">
              {isWorker ? "Taxa total de serviço" : "Total Service Fee"}
            </p>
            <p className="text-blackBlue font-semibold text-xl">
              R$ {booking?.payment?.price}
            </p>
          </div>
          <hr className="w-full mb-4 max-w-lg text-lightGrey" />
          {typeUser === "externalWorker" &&
            booking?.status != "canceled" &&
            booking?.status != "confirmed" &&
            booking?.status != "completed" && (
              <OutlinedButton
                text={isWorker ? "Aceito o trabalho" : "Confirm Booking"}
              />
            )}
          {typeUser === "worker" &&
            booking?.status != "canceled" &&
            booking?.status != "confirmed" &&
            booking?.status != "completed" && (
              <OutlinedButton
                text={isWorker ? "Confirmar reserva" : "Confirm Booking"}
              />
            )}

          {typeUser === "worker" && booking?.status === "confirmed" && (
            <OutlinedButton text={"Terminar o trabalho"} />
          )}
          {(typeUser === "worker" || typeUser === "client") &&
            booking?.status != "canceled" &&
            booking?.status != "completed" && (
              <OutlinedButton
                text={isWorker ? "Cancelar reserva" : "Cancel Booking"}
                secondary={true}
              />
            )}
        </>
      )}
    </div>
  );
}

export default ServiceHistory;
