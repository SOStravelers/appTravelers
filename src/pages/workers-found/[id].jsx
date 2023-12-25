import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import WorkerCard from "@/components/utils/cards/WorkerCard";
import WorkerService from "@/services/WorkerService";
import { random } from "@/lib/utils";
import { Rings } from "react-loader-spinner";
import { useStore } from "@/store";

export default function WorkersFound() {
  const { setService, service } = useStore();
  const router = useRouter();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const data = {
      subservice: service.subServiceId,
      startTime: service.startTime,
      endTime: service.endTime,
    };
    WorkerService.getByAvailability(data).then((response) => {
      console.log(response);
      // WorkerService.list().then((response) => {
      let final = [];
      for (let item of response.data.workers) {
        const itemNuevo = { ...item };
        if (itemNuevo.img.imgUrl != null && itemNuevo.img.imgUrl != "") {
          itemNuevo.img.imgUrl = itemNuevo.img.imgUrl + "?hola=" + random();
        }
        final.push(itemNuevo);
      }
      setWorkers(final);
      setLoading(false);
    });
  };
  useEffect(() => {
    document.title = "Select Worker - SOS Travelers";
    getData();
  }, []);
  const comeBack = () => {
    router.back();
  };

  function getServiceNames(data) {
    // Extraer los nombres de los servicios
    const serviceNames = data.services.map((service) => service.id.name);

    // Unir los nombres en un solo string con comas
    const serviceNamesString = serviceNames.join(", ");

    return serviceNamesString;
  }

  const selectWorker = (workerId) => {
    const hostelId = router.query.id;
    setService({
      hostelId: hostelId,
      workerId: workerId,
    });
  };

  const fullName = ({ first, last }) => {
    return first + " " + (last ?? "");
  };

  return (
    <div className="p-10 pb-20 flex flex-col py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">Nearby You</h1>
      {loading ? (
        <div className="max-w-lg flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      ) : workers.length > 0 ? (
        <>
          <h1 className="my-5 text-grey px-2 text-center max-w-lg">
            These are the available workers, select the one that best suits your
            needs.
          </h1>

          <div className="flex flex-col items-center">
            {workers.map((worker) => (
              <div className="w-full" key={worker.id}>
                <WorkerCard
                  key={worker.id}
                  name={fullName(worker.personalData?.name)}
                  service={
                    worker?.workerData
                      ? getServiceNames(worker.workerData)
                      : "No services"
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
        </>
      ) : (
        <div className="px-4">
          <h1 className="my-5 text-grey px-2 text-center max-w-lg">
            These are not the available workers, select another Date
          </h1>
          <OutlinedButton text={"Back"} onClick={comeBack} />
        </div>
      )}
    </div>
  );
}
