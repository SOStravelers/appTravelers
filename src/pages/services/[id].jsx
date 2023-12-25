import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import ServiceCardGrey from "@/components/utils/cards/ServiceCardGrey";
import { useStore } from "@/store";
import { Rings } from "react-loader-spinner";
import ServiceService from "@/services/ServiceService";
import { QuestionPicture } from "@/constants/icons";
import UserService from "@/services/UserService";
import { set } from "date-fns";

export default function Services() {
  const router = useRouter();
  const { isWorker, user } = useStore();
  const { service, setService } = useStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Choose subservice - SOS Travelers";
    const isFavorite = localStorage.getItem("fromFavorite");
    if (isFavorite) {
      getDataFav();
    } else if (isWorker) {
      console.log(user?.workerData?.services);
      setServices(user?.workerData?.services);
    }
  }, []);

  const getDataFav = async () => {
    try {
      const response = await UserService.getById(router.query.id);

      console.log(response.data);
      setServices(response?.data?.workerData?.services);
      setService({ workerId: router.query.id });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 pb-20 flex flex-col py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <h1 className="my-3 font-semibold text-center max-w-lg">
        Services availables
      </h1>
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
      ) : services && services.length > 0 ? (
        <div className="flex flex-wrap">
          {services.map((s) => (
            <div className="w-1/2">
              <ServiceCardGrey
                key={s.id._id}
                id={s.id._id}
                link={`/subservices/${s.id._id}`}
                name={s.id.name}
                icon={s.id.imgUrl}
                subServices={s.subServices}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center text-greyText max-w-lg mt-6  lg:my-4 xl:my-4 mb-2">
            No services available
          </p>
          <QuestionPicture />
        </div>
      )}
    </div>
  );
}
