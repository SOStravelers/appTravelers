import { useRouter } from "next/router";
import Image from "next/image";
import { PinIcon, ClockIcon } from "@/constants/icons";

function WorkerCardBooking({ booking, name, location, avatar, date, hour }) {
  const router = useRouter();

  const goToDetails = () => {
    router.push({
      pathname: `/service-details/${booking.id}`,
      query: {
        name: name,
        avatar: booking.avatar,
        businessName: location,
        location: `${booking.businessUser.businessData.location.city}, ${booking.businessUser.businessData.location.country}`,
        date: date,
        hour: hour,
        service: booking.service.name,
        subService: booking.subservice.name,
        idWorker: booking.workerUser._id,
      },
    });
  };

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
          <h1 className="font-semibold">{name}</h1>
          <div className="flex items-center mb-1">
            <PinIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">{location}</p>
          </div>
          <div className="flex items-center">
            <ClockIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">
              {date} | {hour}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCardBooking;
