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
      console.log(response.data)
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
        {hostels.map((hostel) => (
          <div className="w-full" key={hostel.id}>
            <HostelCard
              id={hostel.id}
              link={`/reservation/${hostel.id}`}
              name={hostel.businessData.name}
              location={hostel.businessData.location}
              img={hostel.img.imgUrl}
            />
            <hr className="w-full my-5 text-blueBorder" />
          </div>
        ))}
      </div>
    </div>
  );
}
