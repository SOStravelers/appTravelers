import DayButton from "@/components/utils/buttons/DayButton";
import WorkerCardBooking from "@/components/utils/cards/WorkerCardBooking";

function DaySection({ weekDays, selectedDay, setSelectedDay }) {
  return (
    <>
      <div className="flex my-5 md:mx-16">
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

      <h1 className="text-center max-w-lg text-xl my-3">My next Commitments</h1>

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
