import { useState, useEffect } from "react";
import SubserviceService from "@/services/SubserviceService";
import {
  CheckOption,
  CheckOptionChecked,
  ArrowUpIcon,
} from "@/constants/icons";

const ComboBoxEditable = ({ service, selectedOptions, handleChange }) => {
  const [open, setOpen] = useState(false);
  const [subservices, setSubservices] = useState([]);

  useEffect(() => {
    getSubSservices();
  }, [service]);

  const getSubSservices = async () => {
    const id = service?.id;
    SubserviceService.list({ id: id }).then((response) => {
      setSubservices(response.data.docs);
    });
  };

  const subserviceExist = (subserviceId) => {
    const serviceExists = selectedOptions?.find((s) => s?.id === service?.id);
    if (serviceExists) {
      const subserviceExists = serviceExists?.subServices?.find(
        (s) => s === subserviceId
      );
      if (subserviceExists) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <div className="w-full max-w-lg">
      <>
        <div
          className="text-black border border-greyText rounded-lg px-2 py-2 my-5 flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <h1>{service?.name}</h1>
          <ArrowUpIcon
            color={"#5B78C7"}
            onClick={() => setOpen(!open)}
            className={open ? "rotate-180" : ""}
          />
        </div>
        {open &&
          subservices?.length > 0 &&
          subservices.map((subservice) => (
            <div
              key={subservice?.id}
              className="text-black flex justify-between px-5"
            >
              <h1>{subservice?.name}</h1>
              {subserviceExist(subservice?.id) ? (
                <CheckOptionChecked
                  className="cursor-pointer"
                  onClick={() => handleChange(service?.id, subservice?.id)}
                />
              ) : (
                <CheckOption
                  className="cursor-pointer"
                  onClick={() => handleChange(service?.id, subservice?.id)}
                />
              )}
            </div>
          ))}
        {open && subservices?.length === 0 && (
          <p className="text-center -mt-3 text-greyText">
            No subservices register yet
          </p>
        )}
      </>
    </div>
  );
};

export default ComboBoxEditable;
