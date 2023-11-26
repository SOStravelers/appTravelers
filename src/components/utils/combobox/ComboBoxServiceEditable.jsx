import { useState, useEffect } from "react";
import SubserviceService from "@/services/SubserviceService";
import {
  CheckOption,
  CheckOptionChecked,
  ArrowUpIcon,
} from "@/constants/icons";

const ComboBoxServiceEditable = ({
  service,
  selectedOptions,
  handleChange,
}) => {
  const [subservices, setSubservices] = useState([]);

  useEffect(() => {
    setSubservices(service?.subservices);
  }, [service]);

  const serviceExist = (serviceId) => {
    const serviceExists = selectedOptions?.find((s) => s?.id === serviceId);
    if (serviceExists) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="w-full max-w-lg">
      <>
        <div className="text-black border border-greyText rounded-lg px-2 py-2 my-5 flex justify-between items-center cursor-pointer">
          <h1>{service?.name}</h1>
          {serviceExist(service?._id) ? (
            <CheckOptionChecked
              className="cursor-pointer"
              onClick={() => handleChange(service?._id)}
            />
          ) : (
            <CheckOption
              className="cursor-pointer"
              onClick={() => handleChange(service?._id)}
            />
          )}
        </div>
        <div className="text-black px-5">
          {subservices?.length > 0 &&
            subservices.map((subservice, index) => (
              <span key={subservice?._id}>
                {subservice?.name}
                {index !== subservices.length - 1 && ","}{" "}
              </span>
            ))}
        </div>
        {subservices?.length === 0 && (
          <p className="text-center -mt-3 text-greyText">
            No subservices register yet
          </p>
        )}
      </>
    </div>
  );
};

export default ComboBoxServiceEditable;
