import SectionServiceCard from "@/components/utils/cards/SectionServiceCard";

const list1 = [{ name: "Service 1", price: 100 }];
const list2 = [
  { name: "Service 1", price: 100 },
  { name: "Service 2", price: 200 },
  { name: "Service 3", price: 300 },
];

function SectionServices({ services }) {
  console.log("los servicios", services, services[0]);
  return (
    <div>
      <SectionServiceCard
        title={"Popular"}
        list={services ? services[0] : {}}
      />
      <SectionServiceCard title={"Others"} list={services} />
    </div>
  );
}

export default SectionServices;
