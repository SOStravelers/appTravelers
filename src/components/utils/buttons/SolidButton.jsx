import clsx from "clsx";

function SolidButton({ text, color, py = 3, mt = 0, icon, ...props }) {
  return (
    <button
      className={clsx(
        `border border-solid text-white py-${py} mt-${mt} w-full rounded-xl my-2 flex items-center justify-center`,
        color === "blueBorder"
          ? "bg-blueBorder"
          : color === "grey"
          ? "bg-greyButton"
          : color === "rojo"
          ? "bg-red"
          : color === "verde"
          ? "bg-green"
          : color === "black"
          ? "bg-black"
          : "bg-blueBorder"
      )}
      {...props}
    >
      {icon && icon}
      {text}
    </button>
  );
}

export default SolidButton;
