import React from "react";

function OutlinedInput({ ...props }) {
  return (
    <input
      className="border-grey border w-full rounded-xl p-3 my-1"
      {...props}
    ></input>
  );
}

export default OutlinedInput;
