import React from "react";

function OutlinedButton({ text }) {
  return (
    <button className="border border-solid border-negro text-negroTexto font-bold py-4 w-full rounded-xl my-2">
      {text}
    </button>
  );
}

export default OutlinedButton;
