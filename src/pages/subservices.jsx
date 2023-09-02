import SubServiceCard from "@/components/utils/cards/SubServiceCard";

export default function Subservices() {
  return (
    <div className="flex flex-wrap justify-center pt-5 pb-10">
      <SubServiceCard link={"/select-hostel"} name={"Servicio"} />
      <SubServiceCard link={"/select-hostel"} name={"Servicio"} />
      <SubServiceCard link={"/select-hostel"} name={"Servicio"} />
      <SubServiceCard link={"/select-hostel"} name={"Servicio"} />
    </div>
  );
}
