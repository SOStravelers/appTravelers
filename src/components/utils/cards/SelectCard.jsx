import { EditIcon } from "@/constants/icons";

function SelectCard({ title, subtitle, icon: Icon, edit = false, ...props }) {
  return (
    <div
      className="flex items-center my-2 p-3 rounded-xl border border-lightGrey w-full max-w-lg cursor-pointer"
      {...props}
    >
      <div className="h-10 w-10 mr-2 rounded-full border border-blueBorder flex justify-center items-center">
        <Icon />
      </div>
      <div>
        <h1>{title}</h1>
        <h2 className="text-greyText">{subtitle}</h2>
      </div>
      {edit && (
        <div className="ml-auto">
          <EditIcon />
        </div>
      )}
    </div>
  );
}

export default SelectCard;
