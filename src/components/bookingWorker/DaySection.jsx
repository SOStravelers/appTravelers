import DayButton from "@/components/utils/buttons/DayButton";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";

function DaySection({ weekDays, selectedDay, setSelectedDay }) {
  return (
    <>
      <div className="flex md:mx-16 my-5">
        {weekDays.map((day, index) => (
          <DayButton
            key={index}
            day={day.day}
            number={day.number}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        ))}
      </div>

      <h1 className="text-center text-xl my-5 max-w-lg"> 1:00pm</h1>

      <div className="flex flex-col">
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
        <WorkerCardBooking
          link={"/"}
          name={"John Doe"}
          location={"124 street Miro Hotel, Ubud"}
          showArrow={false}
        />
      </div>
    </>
  );
}

export default DaySection;
