import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import ServiceCardGrey from "@/components/utils/cards/ServiceCardGrey";
import ServiceService from "@/services/ServiceService";

export default function Services() {
  const router = useRouter();

  const [services, setServices] = useState([]);

  console.log(services);
  useEffect(() => {
    document.title = "Choose subservice - SOS Travelers";
    getData();
  }, []);

  const getData = async () => {
    const id = router.query.id;
    ServiceService.list({ id: id }).then((response) => {
      setServices(response.data.docs);
    });
  };

  return (
    <div className="flex flex-wrap justify-center md:justify-start py-16 lg:py-24 xl:py-24 md:pl-80">
      {services?.map((s) => (
        <ServiceCardGrey
          key={s.id}
          id={s.id}
          link={`/subservices/${s.id}`}
          name={s.name}
          icon={s.imgUrl}
        />
      ))}
    </div>
  );
}
