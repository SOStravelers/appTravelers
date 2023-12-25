import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import { ThreeDots, InfinitySpin, TailSpin, Rings } from "react-loader-spinner";
import HostelCard from "@/components/utils/cards/HostelCard";
import { random } from "@/lib/utils";
import HostelService from "@/services/HostelService";

export default function SelectHostel() {
  const router = useRouter();
  const { service } = useStore();
  const [loading, setLoading] = useState(true);
  const editing = localStorage.getItem("editing");
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    document.title = "Select Hostel - SOS Travelers";
    getData();
  }, []);

  const getData = async () => {
    HostelService.getByservice(service.serviceId).then((response) => {
      console.log("hostel", response.data);
      setLoading(false);
      let final = [];
      for (let item of response.data.docs) {
        if (item.img.imgUrl != null && item.img.imgUrl != "") {
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
      {/* <OutlinedInput placeholder={"Search here"} /> */}
      <h1 className="my-3 font-semibold text-center max-w-lg">Nearby You</h1>
      {loading && (
        <div className="max-w-lg  flex flex-col items-center justify-center">
          <Rings
            width={100}
            height={100}
            color="#00A0D5"
            ariaLabel="infinity-spin-loading"
          />
          <p className="mt-2">Searching...</p>
        </div>
      )}
      <div className="flex flex-col items-center">
        {hostels.map((hostel) => (
          <div className="w-full" key={hostel.id}>
            <HostelCard
              id={hostel.id}
              editing={editing}
              link={`/reservation/${hostel.id}`}
              services={hostel.businessData.services}
              name={hostel.businessData.name}
              location={hostel?.businessData?.location || "No location"}
              img={
                hostel?.img?.imgUrl && hostel?.img?.imgUrl != ""
                  ? hostel?.img?.imgUrl
                  : "/assets/user.png"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
