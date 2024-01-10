import { useRouter } from "next/router";
import { useStore } from "@/store";
import Image from "next/image";
import { PinIcon, ClockIcon } from "@/constants/icons";
import { WorldIcon } from "@/constants/icons";
import moment from "moment-timezone";
import "moment/locale/pt-br"; // without this line it didn't work
function WorkerCardBooking({
  booking,
  name,
  location,
  avatar,
  date,
  hour,
  service,
  subService,
  status,
}) {
  const { isWorker } = useStore();
  const router = useRouter();

  const goToDetails = () => {
    router.push({
      pathname: `/service-details/${booking.id}`,
    });
  };
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
      padding: "0.2rem 0.6rem",
      borderRadius: "9999px",
      fontSize: "0.80rem",
      fontWeight: "550",
      color: textColor,
      backgroundColor: color,
      maxHeight: "1.6rem",
    };

    return <span style={style}>{isWorker ? statusPortugues : status}</span>;
  }
  function getDayOfWeek(date, location) {
    const language = !location ? "pt-br" : "en";
    return moment.tz(date, "America/Sao_Paulo").locale(language).format("dddd");
  }

  return (
    <div
      className="flex p-4 rounded-2xl border-b-2 border-blueBorder items-center cursor-pointer"
      onClick={() => goToDetails()}
    >
      <div className="flex w-full flex-row  flex-grow">
        <div className="w-20 h-20 rounded-xl bg-blueBorder mr-2 relative">
          <Image
            src={avatar ?? "/assets/proovedor.png"}
            fill
            alt="buenos"
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col flex-grow">
          <h1 className="font-semibold  ml-1">{name}</h1>
          <div className="flex flex-row">
            <div className="flex items-center">
              <ClockIcon color={"#00A0D5"} className="mr-1" />
              <p className="text-blackText text-sm">
                {hour} | {getDayOfWeek(date, location)}
              </p>
            </div>
            <div className="flex flex-grow justify-end">
              <StatusChip status={status} />
            </div>
          </div>

          {location && (
            <div className="flex items-center" style={{ marginLeft: "-1px" }}>
              <PinIcon color={"#00A0D5"} className="ml-1 mr-2" />
              <p className="text-blackText text-sm">{location}</p>
            </div>
          )}
          {/* <div className="flex items-center">
            <Image
              src={"/assets/user.png"}
              width={25}
              height={25}
              alt="profileImg"
            />
            <p className="text-blackText text-sm">{name}</p>
          </div> */}
          {subService && (
            <div className="flex items-center " style={{ marginLeft: "-1px" }}>
              <WorldIcon />
              <p
                style={{ marginTop: "2px" }}
                className="text-blackText text-sm ml-1"
              >
                {subService}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkerCardBooking;
