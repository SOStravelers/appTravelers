import clsx from "clsx";

function SmallButton({ text, selected, ...props }) {
  return (
    <button
      className={clsx(
        " py-1 w-32 rounded-xl  px-1 text-sm ",
        "bg-blueBorder border-darkBlue text-white"
      )}
      {...props}
    >
      {text}
    </button>
  );
}

export default SmallButton;
