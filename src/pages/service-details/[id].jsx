import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TextModal from "@/components/utils/modal/TextModal";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedChatButton from "@/components/utils/buttons/OutlinedChatButton";
import ChatService from "@/services/ChatService";
import SmallButton from "@/components/utils/buttons/SmallButton";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import {
  PinIcon,
  ClockIcon,
  CircleCheckIcon,
  ArrowUpIcon,
} from "@/constants/icons";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import moment from "moment-timezone";
import { Rings } from "react-loader-spinner";
import { toast } from "react-toastify";
import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  isWithinInterval,
  addDays,
} from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { ptBR, enUS } from "date-fns/locale";
import {
  fullName,
  StatusChip,
  getServiceNames,
  formatearFecha,
} from "@/utils/format";

function ServiceHistory() {
  const router = useRouter();
  const { isWorker, user, language } = useStore();
  const [isTextVisible1, setIsTextVisible1] = useState(false);
  const [isTextVisible2, setIsTextVisible2] = useState(false);
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [dataModal, setDataModal] = useState({}); // [title, text, buttonText]
  const [booking, setBooking] = useState(null);
  const [typeUser, setTypeUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inTimeWorker, setInTimeWorker] = useState(true);
  const [inTimeUser, setInTimeUser] = useState(true);
  const [startTimeBooking, setStartTimeBooking] = useState(true);

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
  const toggleText1 = () => {
    setIsTextVisible1(!isTextVisible1);
  };
  const toggleText2 = () => {
    setIsTextVisible2(!isTextVisible2);
  };
  const getBooking = async () => {
    try {
      const id = router.query.id;
      const response = await BookingService.getBookingById(id);
      const booking = response.data;
      setBooking(booking);
      changeformat(booking);
      setLoading(false);
      const brazilTime = moment().tz("America/Sao_Paulo");
      var bookingLastTimeWorker = moment(booking.startTime.isoTime).subtract(
        2,
        "hours"
      );
      var bookingLastTimeUser = moment(booking.startTime.isoTime).subtract(
        0,
        "hours"
      );
      var bookingStartTimeBooking = moment(booking.startTime.isoTime).add(
        10,
        "minutes"
      );
      setInTimeWorker(brazilTime._d < bookingLastTimeWorker._d);
      setInTimeUser(brazilTime._d < bookingLastTimeUser._d);
      setStartTimeBooking(brazilTime._d > bookingStartTimeBooking._d);
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
  const stateBookingUser = async () => {
    console.log("state Booking Worker");
    setLoading(true);
    try {
      let response = null;
      console.log("erna", dataModal.state);
      if (dataModal.state == "completed") {
        response = await BookingService.completeBookingUser(booking._id);
      }
      if (dataModal.state == "canceled") {
        response = await BookingService.cancelBookingUser(booking._id);
      }
      const newBooking = response.data;
      setBooking(newBooking);
      toast.info("Booking updated", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
      changeformat(newBooking);
      setOpenWorkerModal(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("It is not possible to update the reservation", {
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
  const cancelUserModal = async () => {
    setOpenUserModal(false);
  };
  const dialogUser = (state) => {
    const brazilTime = moment().tz("America/Sao_Paulo");
    var bookingLastTimeUser = moment(booking.startTime.isoTime).subtract(
      4,
      "hours"
    );
    if (state == "completed" && booking?.status == "confirmed") {
      setDataModal({
        title: "Complete service",
        text: [
          "If the service was performed successfully, confirm by pressing accept. the worker will be notified",
        ],
        buttonText: "Accept",
        state: "completed",
      });
      setOpenUserModal(true);
    } else if (
      (state == "canceled" && booking?.status == "requested") ||
      booking?.status == "available"
    ) {
      setDataModal({
        title: "Cancel booking",
        text: [
          "If you cancel the booking, the worker will be notified of the cancellation of the service.You will not have charges on your card",
        ],
        buttonText: "Cancel Booking",
        colorAceptButton: "rojo",
        state: "canceled",
      });

      setOpenUserModal(true);
    } else if (state == "canceled" && booking?.status == "confirmed") {
      if (brazilTime._d < bookingLastTimeUser._d) {
        setDataModal({
          title: "Cancel booking",
          text: [
            "If you cancel the booking, the worker will be notified of the cancellation of the service.You will not have charges on your card",
          ],
          buttonText: "Cancel Booking",
          colorAceptButton: "rojo",
          state: "canceled",
        });
      } else {
        setDataModal({
          title: "Cancel booking",
          text: [
            "You are out of time to cancel without charges (4 hours before the start of the service). You will have a charge on your card of 50% of the value if you cancel now. If not, you will be charged in full.",
          ],
          buttonText: "Cancel Booking",
          colorAceptButton: "rojo",
          state: "canceled",
        });
      }

      setOpenUserModal(true);
    }
  };
  const dialogWorker = (state) => {
    const brazilTime = moment().tz("America/Sao_Paulo");
    var bookingLastTimeWorker = moment(booking.startTime.isoTime).subtract(
      2,
      "hours"
    );
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
    } else if (state == "canceled") {
      if (brazilTime._d < bookingLastTimeWorker._d) {
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
      } else {
        toast.error("Não é possível cancelar antes de 2 horas ou menos", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 1500,
          s,
        });
      }
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
            idWorker: booking?.workerUser?._id,

            idClient: booking?.clientUser?._id,
          },
        });
      }
    });
  };

  return (
    //p-10 pb-20 flex flex-col py-16 lg:py-24 xl:py-24 px-5 md:pl-80 md:items-startx
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
          <TextModal
            title={dataModal?.title || "Title"}
            text={dataModal?.text || ["Text"]}
            textCancel="Voltar"
            colorAceptButton={dataModal?.colorAceptButton}
            buttonText={dataModal?.buttonText || "Button Text"}
            open={openWorkerModal}
            setOpen={setOpenWorkerModal}
            onAccept={stateBookingWorker}
            onCancel={cancelWorkerModal}
          />
          <TextModal
            title={dataModal?.title || "Title"}
            text={dataModal?.text || ["Text"]}
            textCancel="Back"
            colorAceptButton={dataModal?.colorAceptButton}
            buttonText={dataModal?.buttonText || "Button Text"}
            open={openUserModal}
            setOpen={setOpenUserModal}
            onAccept={stateBookingUser}
            onCancel={cancelUserModal}
          />
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

          <div className="w-full max-w-lg">
            <div
              className="grid grid-cols-5 gap-4 items-center cursor-pointer"
              onClick={toggleText1}
            >
              <div className="col-span-4 text-left text-sm py-2 my-5">
                <h1 className=" text-blackText font-semibold">
                  {isWorker
                    ? "Informações de localização"
                    : "Location information"}
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
                  ? booking.businessUser?.businessData?.location?.details["pt"]
                  : booking.businessUser?.businessData?.location?.details["en"]}
              </p>
              <div className="mb-2 flex justify-center">
                <a
                  href={booking.businessUser?.businessData?.location?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SmallButton
                    text={isWorker ? "Veja no mapa" : "See on map"}
                  />
                </a>
              </div>
            </div>
          </div>
          <hr className="w-full max-w-lg text-grey" />
          <div className="mt-2 flex justify-center max-w-lg">
            <p className="text-left font-semibold">
              {isWorker ? "Meu cliente" : "My Professional"}
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
                // service={
                //   booking?.workerUser?.workerData?.services && !isWorker
                //     ? booking?.workerUser?.workerData?.services
                //     : ""
                // }
                service={
                  booking?.workerUser?.workerData?.services && !isWorker
                    ? getServiceNames(booking?.workerUser?.workerData, language)
                    : "No services"
                }
              />
              <div className="flex flex-col items-center justify-center max-w-lg">
                {booking?.status != "canceled" &&
                  booking?.status != "completed" &&
                  booking?.status != "requested" &&
                  booking?.status != "available" && (
                    <OutlinedChatButton
                      text="Chat Now"
                      onClick={() => goToChat()}
                    />
                  )}
                {booking.status == "available" && (
                  <p className="text-xs">
                    If the worker doesn&apos;t respond soon, we&apos;ll offer
                    you more options for your schedule with a sprinkle of
                    excitement!
                  </p>
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
                    ? formatearFecha(booking?.date?.stringData, language)
                    : ""
                } `}</p>
                <p className="ml-2">{`${
                  booking?.startTime?.stringData + " hrs" || ""
                }`}</p>
              </div>
            </div>
          </div>

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
              <p className="mb-2">
                {isWorker
                  ? booking.subservice.details["pt"] || ""
                  : booking.subservice.details["en"] || ""}
              </p>
            </div>
          </div>
          <hr className="w-full max-w-lg  text-grey" />
          <div className="flex justify-between items-center w-full max-w-lg mt-4 mb-2">
            <p className="text-blackText font-semibold text-lg">Status</p>
            <p className="text-blackBlue font-semibold text-md">
              <StatusChip status={booking?.status} isWorker={isWorker} />
            </p>
          </div>
          <div className="flex justify-between items-center w-full max-w-lg mt-2 mb-2">
            <p className="text-blackText font-semibold text-sm">
              Booking Number
            </p>
            <p className="text-blackBlue font-semibold text-sm">
              {booking.idKey}
            </p>
          </div>
          <hr className="w-full max-w-lg  text-grey" />
          <div className="flex justify-between items-end w-full max-w-lg mt-5 mb-2">
            <p className="text-blackText font-semibold">
              {isWorker ? "Serviço" : "Service"}
            </p>
            <p className="text-blackBlue font-semibold text-md">
              {booking?.service?.name[language]} -{" "}
              {booking?.subservice?.name[language]}
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
          {typeUser === "worker" && booking?.status == "requested" && (
            <OutlinedButton
              onClick={() => dialogWorker("confirmed")}
              text={isWorker ? "Confirmar reserva" : "Confirm Booking"}
            />
          )}
          {typeUser === "worker" &&
            booking?.status === "confirmed" &&
            startTimeBooking && (
              <OutlinedButton
                onClick={() => dialogWorker("completed")}
                text={"Terminar o trabalho"}
              />
            )}
          {/* {typeUser != "worker" && booking?.status === "confirmed" (
            <OutlinedButton
              onClick={() => dialogUser("completed")}
              text={"Completed Service"}
            />
          )} */}
          {typeUser === "worker" &&
            inTimeWorker &&
            (booking?.status === "confirmed" ||
              booking?.status === "requested") && (
              <OutlinedButton
                onClick={() => dialogWorker("canceled")}
                text={"Cancelar reserva"}
                secondary={true}
              />
            )}
          {typeUser === "client" &&
            inTimeUser &&
            (booking?.status == "requested" ||
              booking?.status == "confirmed" ||
              booking?.status == "available") && (
              <OutlinedButton
                onClick={() => dialogUser("canceled")}
                text={"Cancel Booking"}
                secondary={true}
              />
            )}
        </>
      )}
    </div>
  );
}

export default ServiceHistory;
//comentario
