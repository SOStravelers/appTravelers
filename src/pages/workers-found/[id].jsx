import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import WorkerCard from "@/components/utils/cards/WorkerCard";
import WorkerService from "@/services/WorkerService";

import { useStore } from "@/store";

export default function WorkersFound() {
  const { setService, service } = useStore();
  const router = useRouter();

  const [wokers, setWorkers] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    WorkerService.list().then((response) => {
      console.log(response.data);
      setWorkers(response.data.docs);
    });
  };

  const selectWorker = (workerId) => {
    const hostelId = router.query.id;
    setService({
      hostelId: hostelId,
      workerId: workerId,
    });
  };

  const fullName = ({ first, last }) => {
    console.log(first, last);
    return first + " " + (last ?? "");
  };

  return (
    <div className="flex flex-col items-center md:items-start py-28 px-5 md:pl-80">
      <h1 className="my-5 text-grey text-center max-w-lg">
        These are the available barbers, select the one that best suits your
        needs.
      </h1>
      <div className="flex flex-col items-center">
        {wokers.map((worker) => (
          <div className="w-[80vw]" key={worker.id}>
            <WorkerCard
              key={worker.id}
              name={fullName(worker.personalData?.name)}
              service={"Corte de cabello"}
              score={5}
              img={worker.img?.imgUrl}
              link={`/worker/${worker.id}`}
              onClickSummary={() => {
                selectWorker(worker.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
