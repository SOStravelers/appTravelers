import { useRouter } from "next/router";
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
  const router = useRouter();
  console.log(date);

  const goToDetails = () => {
    router.push({
      pathname: `/service-details/${booking.id}`,
    });
  };
  function StatusChip({ status }) {
    let color;
    let textColor = "white"; // Define textColor here

    switch (status) {
      case "requested":
        color = "grey";
        break;
      case "completed":
        color = "green";
        break;
      case "canceled":
        color = "#e77b7b";
        break;
      case "confirmed":
        color = "#92ef72";
        textColor = "black";
        break;
      default:
        color = "gray";
    }

    const style = {
      display: "inline-block",
      padding: "0.1rem 0.5rem",
      position: "relative",
      transform: "translateY(-2px)",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "400",
      color: textColor,
      backgroundColor: color,
    };

    return <span style={style}>{status}</span>;
  }
  function getDayOfWeek(date, location) {
    console.log("location", !!location);
    const language = !location ? "pt-br" : "en";
    return moment.tz(date, "America/Sao_Paulo").locale(language).format("dddd");
  }

  // Uso de la función
  console.log(getDayOfWeek("2024-01-10")); // Debería imprimir 'quarta-feira'
  return (
    <div
      className="flex p-4 w-full max-w-lg rounded-2xl border-b-2 border-blueBorder items-center cursor-pointer"
      onClick={() => goToDetails()}
    >
      <div className="flex">
        <div className="w-20 h-20 rounded-xl bg-blueBorder mr-2 relative">
          <Image
            src={avatar ?? "/assets/proovedor.png"}
            fill
            alt="buenos"
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold ml-1">
            {name} <StatusChip status={status} />
          </h1>

          <div className="flex items-center">
            <ClockIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">
              {hour} | {getDayOfWeek(date, location)}
            </p>
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
              <p className="text-blackText text-sm">{subService}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkerCardBooking;
