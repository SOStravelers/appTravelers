import React from "react";

function SectionServiceCard({ title, list, type }) {
  console.log(type, list);
  const capitalize = (cadena) => {
    if (!cadena) return "";
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
  };
  return (
    <div
      className="text-black my-5 p-5 w-full max-w-lg flex flex-col justify-center bg-white rounded-2xl"
      style={{
        boxShadow: "2px 2px 12px 0px rgba(0, 0, 0, 0.14)",
      }}
    >
      <h1
        className="mb-5 underline font-semibold underline-offset-8"
        style={{ textDecorationColor: "#00A0D5", textDecorationThickness: 2 }}
      >
        {title}
      </h1>
      <ul>
        {title != "Popular" ? (
          list.map((item, index) => (
            <li key={index} className="flex justify-between my-1">
              <span>
                {type == "business"
                  ? capitalize(item?.service?.name)
                  : type == "worker"
                  ? capitalize(item?.id?.name)
                  : ""}
              </span>
            </li>
          ))
        ) : (
          <span>
            {type == "business"
              ? capitalize(list?.service?.name)
              : type == "worker"
              ? capitalize(list?.id?.name)
              : ""}
          </span>
        )}
      </ul>
    </div>
  );
}

export default SectionServiceCard;
