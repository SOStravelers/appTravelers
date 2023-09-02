import { PinIcon } from "@/constants/icons";

function HostelCard() {
  return (
    <div className="flex w-72 items-center">
      <div className="w-20 h-20 rounded-xl bg-azul"></div>
      <div className="flex flex-col p-2">
        <h1 className="font-semibold">Hotel name</h1>
        <div className="flex items-center">
          <PinIcon color={"#5B78C7"} className="mr-1" />
          <p className="text-grisTexto">Location</p>
        </div>
      </div>
    </div>
  );
}

export default HostelCard;
