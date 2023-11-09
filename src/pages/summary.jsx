import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import WorkerCardSumary from "@/components/utils/cards/WorkerCardSumary";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import Link from "next/link";
import { ClockIcon, ChangeIcon } from "@/constants/icons";

import { useStore } from "@/store";
import HostelService from "@/services/HostelService";
import WorkerService from "@/services/WorkerService";

export default function Summary() {
  const { loggedIn, service } = useStore();
  const router = useRouter();
  const { hour, date } = service;
  const [worker, setWorker] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { hostelId, workerId, subServiceId } = service;

    if (!hostelId || !workerId) router.push("/");

    console.log(service);
    HostelService.get(hostelId).then((response) => {
      setHostel(response.data);
    });
    WorkerService.get(workerId).then((response) => {
      setWorker(response.data);
    });
  };

  const fullName = (data) => {
    if (!data) return "";
    const { first, last } = data;
    return first + (last ?? "");
  };

  const hireNow = () => {
    console.log("perro");
    console.log(loggedIn);
    if (!loggedIn) router.push("login");
    else router.push("/payment");
  };

  return (
    <div className="flex flex-col items-center md:items-start py-28 px-10 md:pl-80">
      <h1 className="my-5 text-grey text-sm text-center max-w-lg">
        Read all the points carefully and make sure that it is what you need.
      </h1>
      <HostelCardSummary
        image={hostel?.img?.imgUrl}
        name={hostel?.businessData?.name}
        location={hostel?.businessData?.location?.city}
        link={"/hostel/" + 1}
        subserviceId={service?.subServiceId}
      />
      <hr className="w-full max-w-lg my-1 text-lightGrey" />
      <WorkerCardSumary
        name={fullName(worker?.personalData?.name)}
        service={"Barbero"}
        score={5}
        link={"/worker/" + 1}
        img={worker?.img?.imgUrl}
        showArrow={false}
        hostelId={hostel?.id}
      />
      <hr className="w-full max-w-lg my-1 text-lightGrey" />
      <div className="flex justify-between w-72 pr-5 my-5">
        <div className="flex ">
          <ClockIcon />
          <p className="ml-2">
            {date} | {hour}
          </p>
        </div>
        <Link href={`/reservation/${service?.hostelId}`}>
          <ChangeIcon />
        </Link>
      </div>
      <div className="flex items-center w-full max-w-lg my-2">
        <input
          type="checkbox"
          className="mr-2"
          checked={selected}
          onChange={() => setSelected(!selected)}
        />
        <p className="text-greyText">
          Accept{" "}
          <Link
            href="/terms-of-service"
            className="font-medium text-blue-600 dark:text-blue-500 underline"
          >
            terms & conditions
          </Link>{" "}
          of SOS
        </p>
      </div>
      <div className="flex justify-between items-end w-full max-w-lg my-5">
        <p className="text-blackText font-semibold">Total Service Fee</p>
        <p className="text-blackBlue font-semibold text-2xl">$ 100.00</p>
      </div>
      <OutlinedButton text={"Hire Now"} onClick={hireNow} />
    </div>
  );
}
