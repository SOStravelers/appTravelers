import DayButton from "@/components/utils/buttons/DayButton";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";

function ListSection({ weekDays, selectedDay, setSelectedDay }) {
  return (
    <div className="mt-10">
      <h1 className="text-center max-w-lg text-xl my-5">Today</h1>
      <div className="flex flex-col">
        <WorkerCardBooking
          link={"/"}
          name={"John Doe"}
          location={"124 street Miro Hotel, Ubud"}
          showArrow={false}
        />
        <h1 className="text-center max-w-lg text-xl my-5">Today</h1>
        <WorkerCardBooking
          link={"/"}
          name={"John Doe"}
          location={"124 street Miro Hotel, Ubud"}
          showArrow={false}
        />
        <WorkerCardBooking
          link={"/"}
          name={"John Doe"}
          location={"124 street Miro Hotel, Ubud"}
          showArrow={false}
        />
      </div>
    </div>
  );
}

export default ListSection;
