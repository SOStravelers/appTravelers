import clsx from "clsx";

function TimeButton({ text, selected, ...props }) {
  return (
    <button
      className={clsx(
        "border border-solid py-2 w-24 rounded-lg my-2 mx-1",
        selected ? "bg-lightBlue border-lightBlue text-white" : "bg-white text-blackText border-greyText"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default TimeButton;
