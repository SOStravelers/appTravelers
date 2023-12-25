import clsx from "clsx";

function DayButton({ day, number, selectedDay, setSelectedDay }) {
  return (
    <div
      className={clsx(
        "cursor-pointer rounded-xl w-14 p-1 h-20 flex flex-col justify-between items-center",
        selectedDay === number ? "bg-blueBorder" : "bg-white"
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
        <div
          className={clsx(
            " h-2 w-2  rounded-full",
            selectedDay === number ? "bg-white" : "bg-black"
          )}
        ></div>
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
