import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import WorkerCard from "@/components/utils/cards/WorkerCard";
import WorkerService from "@/services/WorkerService";
import { random } from "@/lib/utils";
import { useStore } from "@/store";

export default function WorkersFound() {
  const { setService, service } = useStore();
  const router = useRouter();
  const [wokers, setWorkers] = useState([]);

  useEffect(() => {
    document.title = "Select Worker - SOS Travelers";
    getData();
  }, []);

  const getData = async () => {
    WorkerService.list().then((response) => {
      let final = [];
      for (let item of response.data.docs) {
        const itemNuevo = { ...item };
        if (itemNuevo.img.imgUrl != null && itemNuevo.img.imgUrl != "") {
          itemNuevo.img.imgUrl = itemNuevo.img.imgUrl + "?hola=" + random();
        }
        final.push(itemNuevo);
      }
      setWorkers(final);
      // setWorkers(response.data.docs);
    });
  };
  function getSubserviceNameById(workerData) {
    const services = workerData?.services || [];
    const id = service.subServiceId;
    for (const service of services) {
      console.log("service", service);
      console.log("id", id);
      const subService = service.subServices.find((sub) => sub._id === id);

      if (subService) {
        return subService.name;
      }
    }

    // Devuelve null si no se encuentra el subservicio con el ID dado
    return null;
  }
  const selectWorker = (workerId) => {
    const hostelId = router.query.id;
    setService({
      hostelId: hostelId,
      workerId: workerId,
    });
  };
  // console.log("wena", service);

  const fullName = ({ first, last }) => {
    return first + " " + (last ?? "");
  };

  return (
    <div className="flex flex-col items-center md:items-start py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-5 text-grey text-center max-w-lg">
        These are the available workers, select the one that best suits your
        needs.
      </h1>
      <div className="flex flex-col items-center">
        {wokers.map((worker) => (
          <div className="w-[80vw]" key={worker.id}>
            <WorkerCard
              key={worker.id}
              name={fullName(worker.personalData?.name)}
              service={
                worker?.workerData
                  ? getSubserviceNameById(
                      worker.workerData,
                      service.subserviceId
                    )
                  : "hola"
              }
              score={5}
              img={worker.img?.imgUrl || "/assets/user.png"}
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
