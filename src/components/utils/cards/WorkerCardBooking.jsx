import { useRouter } from "next/router";
import Image from "next/image";
import { PinIcon, ClockIcon } from "@/constants/icons";

function WorkerCardBooking({ booking, name, location, avatar, date, hour }) {
  console.log("el avatar", avatar);
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
        idBooking: booking.id,
        idClient: booking.clientUser._id,
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
          <h1 className="font-semibold ml-1">{location}</h1>

          <div className="flex items-center">
            <ClockIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">
              {hour} |{" "}
              {new Date(date).toLocaleDateString("pt-BR", { weekday: "long" })}
            </p>
          </div>
          <div className="flex items-center">
            <Image
              src={"/assets/user.png"}
              width={25}
              height={25}
              alt="profileImg"
            />
            <p className="text-blackText text-sm">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCardBooking;
