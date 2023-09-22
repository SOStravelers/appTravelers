import React from "react";

function SectionServiceCard({ title, list }) {
  return (
    <div
      className="text-black my-5 p-5 w-full flex flex-col justify-center bg-white rounded-2xl"
      style={{
        boxShadow: "2px 2px 12px 0px rgba(0, 0, 0, 0.14)",
      }}
    >
      <h1 className="mb-5 underline font-semibold underline-offset-8">
        {title}
      </h1>
      <ul>
        {list?.map((item, index) => (
          <li key={index} className="flex justify-between my-1">
            <span> {item.name}</span>
            <span className="text-lightBlue"> ${item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SectionServiceCard;
