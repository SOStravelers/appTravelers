import { useLayoutEffect, useState } from "react";

import { useRouter } from "next/router";

import SubServiceCard from "@/components/utils/cards/SubServiceCard";
import SubserviceService from "@/services/SubserviceService";

export default function Subservices() {
  const router = useRouter();

  const [subServices, setSubservices] = useState([]);

  useLayoutEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const id = router.query.id;
    SubserviceService.list({ id: id }).then((response) => {
      setSubservices(response.data.docs);
    });
  };

  return (
    <div className="flex flex-wrap justify-center pt-5 pb-10">
      {subServices?.map((s) => (
        <SubServiceCard key={s.id} link={"/select-hostel"} name={s.name} />
      ))}
    </div>
  );
}
