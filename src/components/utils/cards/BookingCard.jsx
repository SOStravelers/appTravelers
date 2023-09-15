import React from "react";

function BookingCard() {
  return (
    <div className="text-negro py-5 px-3 w-full flex flex-col justify-center shadow-xl bg-blanco rounded-2xl">
      <h1 className="mb-5 underline font-semibold underline-offset-8">Upcoming Booking</h1>
      <div className="flex justify-between">
        <div className="w-14 h-14 rounded-md flex flex-col items-center justify-center border">
          <p className="font-bold">23</p>
          <p className="font-bold">JUL</p>
        </div>
        <p className="w-56 text-negroTexto">
          Lorem ipsum dolor sit amet consectetur. Morbi ut ac.
        </p>
      </div>
    </div>
  );
}

export default BookingCard;
