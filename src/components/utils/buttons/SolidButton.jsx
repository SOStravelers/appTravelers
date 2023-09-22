import clsx from "clsx";

function SolidButton({ text, color = "lightBlue", py = 3, ...props }) {
  return (
    <button
      className={clsx(
        `border border-solid text-white py-${py} w-full rounded-xl my-2`,
        color === "lightBlue"
          ? "bg-lightBlue"
          : color === "grey"
          ? "bg-greyButton"
          : color === "rojo"
          ? "bg-red"
          : color === "verde"
          ? "bg-green"
          : "bg-lightBlue"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default SolidButton;
