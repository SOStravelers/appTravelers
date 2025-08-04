import clsx from "clsx";

export default function InfoItem({
  icon: Icon,
  label,
  value,
  border = true,
  borderColor = "border-gray-300", // nueva prop
  bg = "",
  className = "",
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-1 rounded-lg",
        // border && borderColor,
        // border && "border",
        // bg,
        className
      )}
    >
      {Icon && <Icon className="text-textColor text-lg" />}
      <span className="font-medium text-textColorGray">
        {label}: <strong>{value}</strong>
      </span>
    </div>
  );
}
