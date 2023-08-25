import React from "react";

function BookingCard() {
  return (
    <div
      className="text-negro p-5 flex flex-col justify-center"
      style={{
        width: "100%",
        height: "162px",
        background: "white",
        boxShadow: "2px 2px 21px rgba(0, 0, 0, 0.14)",
        borderRadius: 16,
      }}
    >
      <h1 className="mb-5 underline underline-offset-8">Upcoming Booking</h1>
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
