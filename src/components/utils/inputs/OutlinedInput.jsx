import React from "react";

function OutlinedInput({ text }) {
  return <input className="border-gris border w-full rounded-xl p-3 my-1" placeholder={text} type="text"></input>;
}

export default OutlinedInput;
