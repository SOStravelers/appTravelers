import { useRouter } from "next/router";
import { useStore } from "@/store";
import Image from "next/image";
import { PinIcon, ClockIcon, ArrangeIcon } from "@/constants/icons";
import moment from "moment-timezone";
import { StatusChip, getDayOfWeek } from "@/utils/format";

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

  return (
    <div
      className="flex max-w-lg p-4 rounded-2xl border-b-2 border-blueBorder items-center cursor-pointer"
      onClick={() => goToDetails()}
    >
      <div className="flex w-full flex-row">
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
              <div
                className="flex items-center "
                style={{ marginLeft: "-1px" }}
              >
                <ArrangeIcon />
                <p
                  style={{ marginTop: "2px" }}
                  className="text-blackText text-sm ml-1"
                >
                  {service} - {subService}
                </p>
              </div>
            )}
            <div className="flex flex-grow justify-end">
              <StatusChip status={status} isWorker={isWorker} />
            </div>
          </div>
          <div className="flex items-center">
            <ClockIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">
              {hour} | {getDayOfWeek(date, isWorker)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCardBooking;
