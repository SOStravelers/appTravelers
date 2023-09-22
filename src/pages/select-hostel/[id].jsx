import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import HostelCard from "@/components/utils/cards/HostelCard";

import HostelService from "@/services/HostelService";

export default function SelectHostel() {
  const router = useRouter();

  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const id = router.query.id;
    HostelService.list({ id: id }).then((response) => {
      setHostels(response.data.docs);
    });
  };

  const fullName = ({ first, last }) => {
    return first + (last ?? "");
  };

  return (
    <div className="p-10 pb-20 flex flex-col">
      <OutlinedInput placeholder={"Search here"} />
      <h1 className="my-8 font-semibold text-center">Nearby You</h1>
      <div className="flex flex-col items-center">
        {hostels.map((h) => (
          <div key={h.id}>
            <HostelCard
              link={`/reservation/${h.id}`}
              name={fullName(h.personalData?.name)}
              location={"Location"}
            />
            <hr className="w-full my-5 text-blueBorder" />
          </div>
        ))}
      </div>
    </div>
  );
}
