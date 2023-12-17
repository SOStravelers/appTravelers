import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import ServiceCardGrey from "@/components/utils/cards/ServiceCardGrey";
import { useStore } from "@/store";
import ServiceService from "@/services/ServiceService";
import { QuestionPicture } from "@/constants/icons";

export default function Services() {
  const router = useRouter();
  const { isWorker, user } = useStore();
  const [services, setServices] = useState([]);

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
    console.log("query", router.query);
    const services = JSON.parse(router.query.services);
    setServices(services);
  };

  return (
    <div className="flex flex-wrap justify-center md:justify-start py-16 lg:py-24 xl:py-24 md:pl-80">
      {services && services.length > 0 ? (
        services.map((s) => (
          <ServiceCardGrey
            key={s.id._id}
            id={s.id._id}
            link={`/subservices/${s.id._id}`}
            name={s.id.name}
            icon={s.id.imgUrl}
            subServices={s.subServices}
          />
        ))
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
