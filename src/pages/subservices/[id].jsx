import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import SubServiceCard from "@/components/utils/cards/SubServiceCard";
import SubserviceService from "@/services/SubserviceService";

export default function Subservices() {
  const router = useRouter();

  const [subServices, setSubservices] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const id = router.query.id;
    SubserviceService.list({ id: id }).then((response) => {
      setSubservices(response.data.docs);
    });
  };

  return (
    <div className="flex flex-wrap justify-center md:justify-start py-28 md:pl-80">
      {subServices?.map((s) => (
        <SubServiceCard
          key={s.id}
          id={s.id}
          link={`/select-hostel/${s.id}`}
          name={s.name}
        />
      ))}
    </div>
  );
}
