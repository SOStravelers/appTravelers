import clsx from "clsx";

function SmallButton({ text, selected, ...props }) {
  return (
    <button
      className={clsx(
        " py-1 w-28 rounded-xl   text-sm ",
        "bg-blueBorder border-darkBlue text-white"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default SmallButton;
