import { useRouter } from "next/router";
import WorkerProfileCardDetails from "@/components/utils/cards/WorkerProfileCardDetails";
import SolidButton from "@/components/utils/buttons/SolidButton";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import AcceptRequestButton from "@/components/utils/buttons/AceptRequestButton";
import ChatService from "@/services/ChatService";
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
    idBooking,
    idClient,
  } = router.query;

  const goToChat = () => {
    ChatService.createChatRoom({ booking: idBooking, user: idWorker }).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          const type = localStorage.getItem("type");
          console.log(type);
          router.push({
            pathname:
              type === "worker"
                ? `/worker/chat/${res.data._id}`
                : `/chat/${res.data._id}`,
            query: {
              name: name,
              avatar: avatar?.length === 0 ? "/assets/proovedor.png" : avatar,
              service: service,
              date: date,
              hour: hour,
              idWorker: idWorker,
              businessName: businessName,
              location: location,
              subService: subService,
              idBooking: idBooking,
              idClient: idClient,
            },
          });
        }
      }
    );
    /*router.push({
      pathname: `/chat/${idWorker}`,
      query: {
        name: name,
        avatar: avatar?.length === 0 ? "/assets/proovedor.png" : avatar,
        service: service,
        date: date,
        hour: hour,
        idWorker: idWorker,
        businessName: businessName,
        location: location,
        subService: subService,
        idBooking: idBooking,
      },
    });
    */
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
          text="Request Open"
          icon={<CircleCheckIcon className="mr-2" />}
        />
      </div>
      <div className="flex flex-col justify-between items-center w-full max-w-lg mt-20">
        <AcceptRequestButton
          text="Accept Request"
          color="black"
        />
      </div>
    </div>
  );
}

export default ServiceHistory;
