import { useRouter } from "next/router";
import WorkerProfileCardDetails from "@/components/utils/cards/WorkerProfileCardDetails";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import OutlinedChatButton from "@/components/utils/buttons/OutlinedChatButton";
import { PinIcon, ClockIcon, CircleCheckIcon } from "@/constants/icons";

function ServiceHistory() {
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
  } = router.query;

  const goToChat = () => {
    return () => {
      router.push("/chat/1");
    };
  };

  return (
    <div className="flex flex-col py-20 px-5 md:pl-80">
      <WorkerProfileCardDetails
        name={name}
        id={idWorker}
        avatar={avatar?.length ? avatar : "/assets/proovedor.png"}
      />
      <div className="flex justify-between border-t border-b border-greyText">
        <div className="flex flex-col my-3">
          <h1 className="font-semibold ml-1">
            {businessName ? businessName : "No disponible"}
          </h1>
          <div className="flex items-center mt-1">
            <PinIcon color={"#00A0D5"} className="mr-1" />
            <p className="text-blackText text-sm">
              {location ? location : "No disponible"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full max-w-lg pr-1 py-5 border-b border-greyText">
        <div className="flex  ">
          <ClockIcon />
          <p className="ml-2">{`${date || ""} | ${hour || ""}`}</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-lg my-5">
        <p className="text-blackText font-semibold w-3/4">
          {service}: {subService}
        </p>
        <SolidButton
          text="Payment Done"
          icon={<CircleCheckIcon className="mr-2" />}
        />
      </div>
      <div className="flex flex-col justify-between items-center w-full max-w-lg mt-20">
        <OutlinedChatButton
          text="Chat Now"
          color="black"
          onClick={goToChat()}
        />
        <OutlinedButton text="Cancel Booking" secondary={true} />
      </div>
    </div>
  );
}

export default ServiceHistory;
