import React from "react";

function OutlinedInput({ icon: Icon, width, ...props }) {
  return (
    <div className="relative" style={{ width: width || "100%" }}>
      <input
        className={`
          peer
          border border-gray-300 bg-gray-100
          focus:border-blueBorder focus:outline-none
          w-full max-w-lg rounded-md px-2 py-2 my-1
          ${Icon ? "pl-12" : ""}
          transition
          placeholder:text-sm 
        `}
        {...props}
      />
      {Icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <div
            className={`
              border border-gray-400 rounded-full p-1 flex items-center justify-center transition
              peer-focus:border-blueBorder peer-focus:bg-blueBorder/10
            `}
          >
            <Icon
              className={`
                h-3 w-3 text-gray-400 transition
                peer-focus:text-blueBorder
              `}
            />
          </div>
        </span>
      )}
    </div>
  );
}

export default OutlinedInput;
