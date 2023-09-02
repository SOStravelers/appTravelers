import OutlinedInput from "@/components/utils/inputs/OutlinedInput";
import HostelCard from "@/components/utils/cards/HostelCard";

export default function SelectHostel() {
  return (
    <div className="p-10 flex flex-col">
      <OutlinedInput placeholder={"Search here"} />
      <h1 className="my-8 font-semibold">Nearby You</h1>
      <div className="flex flex-col items-center">
        <HostelCard
          link={"reservation"}
          name={"Hotel Name"}
          location={"Location"}
        />
        <hr className="w-full my-5 text-grisClaro" />
        <HostelCard
          link={"reservation"}
          name={"Hotel Name"}
          location={"Location"}
        />
        <hr className="w-full my-5 text-grisClaro" />
        <HostelCard
          link={"reservation"}
          name={"Hotel Name"}
          location={"Location"}
        />
      </div>
    </div>
  );
}
