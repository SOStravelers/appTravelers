import React from "react";
import clsx from "clsx";

function OutlinedButton({ text, secondary, ...props }) {
  return (
    <button
      className={clsx(
        "border-2 border-solid max-w-lg text-lg py-3 w-full rounded-xl my-2 cursor-pointer",
        secondary
          ? "text-grey border-grey"
          : "border-blueBorder text-blackText bg-blueButton"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default OutlinedButton;
