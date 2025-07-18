import { MdEmail } from "react-icons/md";
function OptionCard({ title, subtitle, icon: Icon, check = false, ...props }) {
  return (
    <div
      className="flex w-full   items-center my-2 p-3 bg-backgroundCard rounded-xl border border-textColorGray  cursor-pointer"
      {...props}
    >
      {Icon && (
        <div className="h-10 w-10 mr-2 rounded-full border border-textColorGray  flex justify-center items-center">
          <Icon className="text-textColor text-xl" />
        </div>
      )}
      <div>
        <h1 className="text-textColor">{title}</h1>
        <h2 className="text-textColor">{subtitle}</h2>
      </div>
      {check && (
        <div className="ml-auto">
          <CheckIcon />
        </div>
      )}
    </div>
  );
}

export default OptionCard;
