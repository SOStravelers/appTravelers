import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TextModal from "@/components/utils/modal/TextModal";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import { PinIcon, ClockIcon, CircleCheckIcon } from "@/constants/icons";
import { useStore } from "@/store";
import BookingService from "@/services/BookingService";
import moment from "moment-timezone";
import { Rings } from "react-loader-spinner";
import { toast } from "react-toastify";
import { fullName, StatusChip, formatearFecha } from "@/utils/format";
function ServiceHistory() {
  const router = useRouter();
  const { isWorker, user } = useStore();
  const [openWorkerModal, setOpenWorkerModal] = useState(false);
  const [dataModal, setDataModal] = useState({}); // [title, text, buttonText]
  const [booking, setBooking] = useState(null);
  const [typeUser, setTypeUser] = useState(null);
  const [inTimeWorker, setInTimeWorker] = useState(true);
  const [loading, setLoading] = useState(true);
  const [startTimeBooking, setStartTimeBooking] = useState(true);

  useEffect(() => {
    document.title = "Serviço disponível | SOS Travelers";
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
      const brazilTime = moment().tz("America/Sao_Paulo");
      var bookingLastTimeWorker = moment(booking.startTime.isoTime).subtract(
        2,
        "hours"
      );
      var bookingStartTimeBooking = moment(booking.startTime.isoTime).add(
        10,
        "minutes"
      );
      setInTimeWorker(brazilTime._d < bookingLastTimeWorker._d);
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
      response = await BookingService.confirmBookingWorkerExternal(booking._id);

      const newBooking = response.data;
      console.log("finalmente");
      router.push(`/service-details/${newBooking._id}`);
      setOpenWorkerModal(false);
      // setLoading(false);
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
            <p className="text-left font-semibold">nome do cliente</p>
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
              <StatusChip status={booking?.status} isWorker={isWorker} />
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

          {(typeUser === "worker" || typeUser === "externalWorker") &&
            booking?.status === "available" && (
              <OutlinedButton
                onClick={() => dialogWorker("confirmed")}
                text="Eu quero esse trabalho"
              />
            )}
        </>
      )}
    </div>
  );
}

export default ServiceHistory;
