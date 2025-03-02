import { useState, useEffect } from "react";
import SubserviceService from "@/services/SubserviceService";
import { useStore } from "@/store";
import {
  CheckOption,
  CheckOptionChecked,
  ArrowUpIcon,
} from "@/constants/icons";

const ComboBoxEditable = ({ service, selectedOptions, handleChange }) => {
  const [open, setOpen] = useState(true);
  const [subservices, setSubservices] = useState([]);
  const { language } = useStore();

  useEffect(() => {
    // Verificar si hay algún subservicio que cumple la condición
    const someSubserviceIsSelected = subservices.some((subservice) =>
      subserviceExist(service?._id, subservice?._id)
    );

    // Establecer el estado 'open' basado en la condición
    setOpen(someSubserviceIsSelected);
  }, [service, subservices]);

  useEffect(() => {
    setSubservices(service?.subservices);
  }, [service]);

  const capitalize = (cadena) => {
    if (!cadena) return;
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
  };

  const subserviceExist = (serviceId, subserviceId) => {
    // console.log("serviceId, subserviceId", serviceId, subserviceId);
    const serviceExists = selectedOptions?.find(
      (s) => s?.id?._id === serviceId
    );
    if (serviceExists) {
      const subserviceExists = serviceExists?.subServices?.find(
        (s) => s?._id === subserviceId
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
        {service && (
          <div
            className="text-black border border-greyText rounded-lg px-2 py-2 my-5 flex justify-between items-center cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <h1 className="text-lg ml-3">
              {capitalize(service?.name[language])}
            </h1>
            <ArrowUpIcon
              color={"#5B78C7"}
              onClick={() => setOpen(!open)}
              className={!open ? "rotate-180" : ""}
            />
          </div>
        )}

        {open &&
          subservices?.length > 0 &&
          subservices.map((subservice, index) => (
            <div key={index} className="text-black flex justify-between px-4">
              <h1>{capitalize(subservice?.name[language])}</h1>
              {subserviceExist(service?._id, subservice?._id) ? (
                <CheckOptionChecked
                  className="cursor-pointer"
                  onClick={() => handleChange(service, subservice)}
                />
              ) : (
                <CheckOption
                  className="cursor-pointer"
                  onClick={() => handleChange(service, subservice)}
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
