import clsx from "clsx";

function TimeButton({ text, selected, ...props }) {
  return (
    <button
      className={clsx(
        "border border-solid py-1 w-20 mx-2 rounded-lg my-1 ",
        selected
          ? "bg-blueBorder border-blueBorder text-white"
          : "bg-white text-blackText border-greyText"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default TimeButton;
