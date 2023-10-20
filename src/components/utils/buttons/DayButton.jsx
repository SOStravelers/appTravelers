import clsx from "clsx";

function DayButton({ day, number, selectedDay, setSelectedDay }) {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded-xl w-14 p-2 h-20 flex flex-col justify-between items-center",
        selectedDay === number ? "bg-lightBlue" : "bg-white"
      )}
      onClick={() => setSelectedDay(number)}
    >
      <p
        className={clsx(
          " text-center",
          selectedDay === number ? "text-white" : "text-greyText"
        )}
      >
        {day}
      </p>
      <div className="flex flex-col items-center">
        <div className="h-2 w-2 bg-dotBlue rounded-full"></div>
        <p
          className={clsx(
            "text-center",
            selectedDay === number ? "text-white" : "text-blackText"
          )}
        >
          {number}
        </p>
      </div>
    </div>
  );
}

export default DayButton;
