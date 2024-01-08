import { useRouter } from "next/router";
import Image from "next/image";
import { StarIcon, FavIconBorder, ClockIcon } from "@/constants/icons";
import SolidButton from "../buttons/SolidButton";

function WorkerProfileCardChat() {
  const router = useRouter();
  const {
    name,
    avatar,
    businessName,
    location,
    date,
    hour,
    service,
    subService,
    idWorker,
    idBooking,
  } = router.query;
  const goToServiceDetails = () => {
    router.push({
      pathname: `/service-details/${idBooking}`,
    });
  };
  return (
    <div className="flex flex-col">
      <div className="flex py-4 w-80 rounded-lg my-2 items-center">
        <div className="w-36 h-32 rounded-2xl mr-2">
          <div className="bg-blueBorder w-full h-full rounded-2xl relative">
            <Image
              src={avatar ?? "/assets/proovedor.png"}
              fill
              alt="nuevo"
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="font-semibold text-black">{name}</h1>
          </div>
          <p className="text-blackText my-2">{service}</p>
          <div className="flex items-center">
            <SolidButton
              text="Service Resume"
              color="black"
              onClick={goToServiceDetails}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <ClockIcon color={"#00A0D5"} className="mr-1" />
        <p className="text-blackText text-sm">
          {date} | {hour}
        </p>
      </div>
    </div>
  );
}

export default WorkerProfileCardChat;
