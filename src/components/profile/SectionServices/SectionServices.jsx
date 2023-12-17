import SectionServiceCard from "@/components/utils/cards/SectionServiceCard";

const list1 = [{ name: "Service 1", price: 100 }];
const list2 = [
  { name: "Service 1", price: 100 },
  { name: "Service 2", price: 200 },
  { name: "Service 3", price: 300 },
];
function SectionServices({ services, type }) {
  return (
    <div>
      <SectionServiceCard
        title={"Popular"}
        type={type}
        list={services ? services[0] : {}}
      />
      <SectionServiceCard type={type} title={"Others"} list={services} />
    </div>
  );
}

export default SectionServices;
