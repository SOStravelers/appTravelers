import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import WorkerCard from "@/components/utils/cards/WorkerCard";
import HostelCardSummary from "@/components/utils/cards/HostelCardSummary";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import Link from "next/link";
import { ClockIcon, EditIcon } from "@/constants/icons";

import { useStore } from "@/store";
import HostelService from "@/services/HostelService";
import WorkerService from "@/services/WokerService";

export default function Summary() {
  const { service } = useStore();
  const router = useRouter();

  const [worker, setWorker] = useState(null);
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { hostelId, workerId } = service;

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

  return (
    <div className="flex flex-col px-8 items-center pb-20">
      <h1 className="my-5 text-grey text-center">
        Read all the points carefully and make sure that it is what you need.
      </h1>
      <HostelCardSummary
        name={fullName(hostel?.personalData?.name)}
        location={"Ubicación"}
        link={"/hostel/" + 1}
      />
      <WorkerCard
        name={fullName(worker?.personalData?.name)}
        service={"Barbero"}
        score={5}
        link={"/worker/" + 1}
        showArrow={false}
      />
      <div className="flex justify-between w-full my-5">
        <div className="flex ">
          <ClockIcon />
          <p className="ml-2">4 Aug, 2023 | 04:30 PM</p>
        </div>
        <EditIcon />
      </div>
      <div className="flex w-full my-5">
        <input id="terms" type="checkbox" className="mr-2" />
        <label className="text-blackText" htmlFor="terms">
          Accept terms & conditions of SOS
        </label>
      </div>
      <div className="flex justify-between items-end w-full my-5">
        <p className="text-blackText font-semibold">Total Service Fee</p>
        <p className="text-lightBlue font-semibold text-2xl">$ 100.00</p>
      </div>
      <Link href={"/payment"} className="w-full">
        <OutlinedButton text={"Hire Now"} />
      </Link>
    </div>
  );
}
