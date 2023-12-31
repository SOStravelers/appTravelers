import clsx from "clsx";

function TimeButton({ text, selected, ...props }) {
  return (
    <button
      className={clsx(
        "border border-solid py-2 w-20 rounded-lg my-2 mx-1",
        selected
          ? "bg-blueBorder border-darkBlue text-white"
          : "bg-white text-blackText border-greyText"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default TimeButton;
