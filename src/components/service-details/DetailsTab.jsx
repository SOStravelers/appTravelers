import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import WorkerProfileCardDetails from "@/components/utils/cards/WorkerProfileCardDetails";
import SolidButton from "@/components/utils/buttons/SolidButton";
import TextModal from "@/components/utils/modal/TextModal";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedChatButton from "@/components/utils/buttons/OutlinedChatButton";
import ChatService from "@/services/ChatService";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import { PinIcon, ClockIcon, CircleCheckIcon } from "@/constants/icons";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import { Rings } from "react-loader-spinner";
import { toast } from "react-toastify";
import { data } from "autoprefixer";

function ServiceHistory() {
  const router = useRouter();
  const { isWorker, user } = useStore();
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  const [dataModal, setDataModal] = useState({}); // [title, text, buttonText]
  const [booking, setBooking] = useState(null);
  const [typeUser, setTypeUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Service Details | SOS Travelers";
    getBooking();
  }, []);

  const changeformat = async (booking) => {
    if (user?._id === booking?.workerUser._id && isWorker) {
      console.log("worker");
      setTypeUser("worker");
    } else if (user?._id === booking?.clientUser?._id) {
      console.log("client");
      setTypeUser("client");
    } else if (user?._id != booking?.workerUser?._id && isWorker) {
      console.log("externalWorker");
      setTypeUser("externalWorker");
    } else {
      router.push("/");
    }
  };

  const getBooking = async () => {
    try {
      const id = router.query.id;
      const response = await BookingService.getBookingById(id);
      const booking = response.data;
      setBooking(booking);
      changeformat(booking);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const stateBookingWorker = async () => {
    console.log("state Booking Worker");
    setLoading(true);
    try {
      let response = null;
      console.log("erna", dataModal.state);
      if (dataModal.state == "confirmed") {
        response = await BookingService.confirmBookingWorker(booking._id);
      }
      if (dataModal.state == "completed") {
        response = await BookingService.completeBookingWorker(booking._id);
      }
      if (dataModal.state == "canceled") {
        response = await BookingService.cancelBookingWorker(booking._id);
      }
      const newBooking = response.data;
      setBooking(newBooking);
      toast.info("Reserva atualizada", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
      changeformat(newBooking);
      setOpenWorkerModal(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Não é possível atualizar a reserva", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
      setOpenWorkerModal(false);
      setLoading(false);
    }
  };
  const cancelWorkerModal = async () => {
    setOpenWorkerModal(false);
  };
  const dialogWorker = (state) => {
    console.log("activando dialogo");
    if (state == "confirmed") {
      setDataModal({
        title: "Aceitar solicitação e confirmar reserva",
        text: [
          "Ao confirmar a reserva, o cliente será notificado da confirmação do serviço",
        ],
        buttonText: "Confirmar",
        state: "confirmed",
      });
      setOpenWorkerModal(true);
    } else if (state == "completed") {
      setDataModal({
        title: "Completar reserva",
        text: [
          "Caso confirme que não poderá alterar a reserva, o cliente será avisado e o serviço será marcado como concluído",
        ],
        buttonText: "Confirmar",
        state: "completed",
      });

      setOpenWorkerModal(true);
    } else {
      setDataModal({
        title: "Cancelar reserva",
        text: [
          "Ao cancelar a reserva, o cliente será notificado da cancelamento do serviço",
        ],
        buttonText: "Cancelar Reserva",
        colorAceptButton: "rojo",
        state: "canceled",
      });
      setOpenWorkerModal(true);
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
  };
  const fullName = (data) => {
    if (!data) return "";
    const { first, last } = data;
    return first + " " + (last ?? "");
  };
  function formatearFecha(fechaStr, isWorker) {
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
    <div></div>
    //p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80 md:items-startx
  );
}

export default ServiceHistory;
