import React from "react";

function OptionCard({ title, subtitle, icon: Icon, ...props }) {
  return (
    <div
      className="flex items-center my-2 p-2 rounded-xl border border-lightGrey"
      {...props}
    >
      <div className="h-10 w-10 mr-2 rounded-full border border-blueBorder flex justify-center items-center">
        <Icon />
      </div>
      <div>
        <h1>{title}</h1>
        <h2 className="text-greyText">{subtitle}</h2>
      </div>
    </div>
  );
}

export default OptionCard;
