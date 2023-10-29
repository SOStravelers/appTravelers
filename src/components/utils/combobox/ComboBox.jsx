import { useState, useEffect } from "react";
import {
  CheckOption,
  CheckOptionChecked,
  ArrowUpIcon,
} from "@/constants/icons";

const ComboBox = ({
  service,
  selectedOptions,
  setSelectedOptions,
  handleChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-lg">
      <>
        <div
          className="text-black border border-greyText rounded-lg px-2 py-2 my-5 flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <h1>{service?.servicio}</h1>
          <ArrowUpIcon
            color={"#5B78C7"}
            onClick={() => setOpen(!open)}
            className={open ? "rotate-180" : ""}
          />
        </div>
        {open &&
          service?.subservicios.map((subservice) => (
            <div
              key={subservice?.id}
              className="text-black flex justify-between px-5"
            >
              <h1>{subservice?.name}</h1>
              {selectedOptions.includes(subservice?.id) ? (
                <CheckOptionChecked
                  onClick={() => handleChange(subservice?.id)}
                />
              ) : (
                <CheckOption onClick={() => handleChange(subservice?.id)} />
              )}
            </div>
          ))}
      </>
    </div>
  );
};

export default ComboBox;
