import React from "react";

function OutlinedButton({ text, ...props }) {
  return (
    <button
      className="border-2 border-solid border-blueBorder text-blackText bg-blueButton text-lg py-3 w-full rounded-xl my-2"
      {...props}
    >
      {text}
    </button>
  );
}

export default OutlinedButton;
