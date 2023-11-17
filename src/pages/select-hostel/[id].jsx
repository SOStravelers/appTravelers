import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import HostelCard from "@/components/utils/cards/HostelCard";
import { random } from "@/lib/utils";
import HostelService from "@/services/HostelService";

export default function SelectHostel() {
  const router = useRouter();

  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    document.title = "Select Hostel - SOS Travelers";
    getData();
  }, []);

  const getData = async () => {
    const id = router.query.id;
    HostelService.list({ id: id }).then((response) => {
      console.log("hostel", response.data);
      let final = [];
      for (let item of response.data.docs) {
        if (item.img.imgUrl != null) {
          item.img.imgUrl = item.img.imgUrl + "?hola=" + random();
        }
        final.push(item);
      }
      setHostels(final);
    });
  };

  const fullName = ({ first, last }) => {
    return first + (last ?? "");
  };

  return (
    <div className="p-10 pb-20 flex flex-col py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      <OutlinedInput placeholder={"Search here"} />
      <h1 className="my-2 font-semibold text-center max-w-lg">Nearby You</h1>
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
          </div>
        ))}
      </div>
    </div>
  );
}
