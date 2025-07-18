import { MdEmail } from "react-icons/md";

function OptionCardPreview({
  title,
  subtitle,
  description,
  subDescription,
  icon: Icon,
  check = false,
  ...props
}) {
  return (
    <div
      className="flex w-full items-center my-2 p-3 bg-backgroundCard rounded-xl border border-textColorGray dark:border-none cursor-pointer"
      {...props}
    >
      {Icon && (
        <div className="h-10 w-10 mr-2 rounded-full border border-textColorGray dark:border-none flex justify-center items-center">
          <Icon className="text-textColor text-xl" />
        </div>
      )}
      <div>
        <h1 className="text-textColor text-xxs ">{title}</h1>
        <h2 className="text-textColor mt-1 text-md font-semibold">
          {subtitle}
        </h2>
        <p className="text-textColor mt-1  text-xs font-semibold">
          {description}
        </p>
        <p className="text-textColor  text-xs font-semibold">
          {subDescription}
        </p>
      </div>
      {check && (
        <div className="ml-auto">
          <CheckIcon />
        </div>
      )}
    </div>
  );
}

export default OptionCardPreview;
