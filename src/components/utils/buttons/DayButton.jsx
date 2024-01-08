import clsx from "clsx";

function DayButton({ day, number, selectedDay, setSelectedDay, bookings }) {
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
        <div className="flex">
          {number === selectedDay &&
            Array.from({ length: Math.min(bookings, 3) }).map((_, index) => (
              <div
                key={index}
                className={clsx(
                  "h-2 w-2 mx-1 rounded-full",
                  selectedDay === number ? "bg-white" : "bg-black"
                )}
              ></div>
            ))}
        </div>
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
