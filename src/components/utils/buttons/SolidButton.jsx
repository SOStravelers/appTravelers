import React from "react";

function SolidButton({ text, ...props }) {
  return (
    <button
      className="border border-solid border-azul bg-azul text-blanco py-4 w-full rounded-xl my-2"
      {...props}
    >
      {text}
    </button>
  );
}

export default SolidButton;
