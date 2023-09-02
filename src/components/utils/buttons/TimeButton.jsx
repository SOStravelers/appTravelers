import clsx from "clsx";

function TimeButton({ text, selected, ...props }) {
  return (
    <button
      className={clsx(
        "border border-solid py-2 w-24 rounded-lg my-2 mx-1",
        selected ? "bg-azul border-azul text-blanco" : "bg-blanco text-negroTexto border-grisTexto"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default TimeButton;
