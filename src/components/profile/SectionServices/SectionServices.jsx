import SectionServiceCard from "@/components/utils/cards/SectionServiceCard";

const list1 = [{ name: "Service 1", price: 100 }];
const list2 = [
  { name: "Service 1", price: 100 },
  { name: "Service 2", price: 200 },
  { name: "Service 3", price: 300 },
];

function SectionServices() {
  return (
    <div>
      <SectionServiceCard title={"Popular"} list={list1} />
      <SectionServiceCard title={"Others"} list={list2} />
    </div>
  );
}

export default SectionServices;
