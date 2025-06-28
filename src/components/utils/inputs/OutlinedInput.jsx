import React from "react";

function OutlinedInput({ icon: Icon, width, ...props }) {
  return (
    <div
      className="relative"
      style={{ width: width || "100%" }} // Usa la prop `width` o un valor por defecto
    >
      {Icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="border border-blueBorder rounded-full p-1 flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        </span>
      )}
      <input
        className={`border border-gray-300 bg-gray-100 focus:border-blueBorder focus:outline-none border-1 border w-full max-w-lg rounded-md px-2 py-2 my-1 ${
          Icon ? "pl-12" : ""
        }`}
        {...props}
      />
    </div>
  );
}

export default OutlinedInput;
