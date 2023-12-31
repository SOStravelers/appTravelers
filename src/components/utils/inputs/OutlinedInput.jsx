import React from "react";

function OutlinedInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="border border-blueBorder rounded-full p-1 flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        </span>
      )}
      <input
        className={`border-blueBorder focus:border-blueBorder focus:outline-none border-1 border w-full max-w-lg rounded-xl p-3 my-1 ${
          Icon ? "pl-12" : ""
        }`}
        {...props}
      />
    </div>
  );
}

export default OutlinedInput;
