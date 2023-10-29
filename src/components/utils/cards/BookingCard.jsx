import { mazzard } from "@/utils/mazzardFont";
import { PinIcon, ClockIcon } from "@/constants/icons";

function BookingCard({ direction, date }) {
  return (
    <div className="text-black py-5 mb-10 w-full mx-auto flex flex-col justify-center border-b border-blueBorder bg-white rounded-2xl">
      <div className="bg-blueBorder w-full px-3 py-1 rounded-t-2xl">
        <h1
          className={`text-white rounded-r-2xl rounded-2xl font-semibold ${mazzard.className}`}
          style={{ backgroundClip: "padding-box" }}
        >
          Upcoming Booking
        </h1>
      </div>
      <div className="flex flex-col justify-between px-3 mt-5">
        <div className="flex items-center mb-2">
          <PinIcon color={"#00A0D5"} className="mr-2" />
          <p className="text-blackText">{direction}</p>
        </div>
        <div className="flex items-center">
          <ClockIcon color={"#00A0D5"} className="mr-2" />
          <p className="text-blackText">{date}</p>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;
