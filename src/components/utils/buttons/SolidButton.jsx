import clsx from "clsx";

function SolidButton({ text, color = "azul", ...props }) {
  return (
    <button
      className={clsx(
        "border border-solid text-blanco py-4 w-full rounded-xl my-2",
        color === "azul"
          ? "bg-azul"
          : color === "gris"
          ? "bg-grisBoton"
          : color === "rojo"
          ? "bg-error"
          : color === "verde"
          ? "bg-success"
          : "bg-azul"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default SolidButton;
