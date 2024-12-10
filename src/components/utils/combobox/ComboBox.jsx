import { useState, useEffect } from "react";
import SubserviceService from "@/services/SubserviceService";
import { CheckOptionChecked, ArrowUpIcon } from "@/constants/icons";
import { useStore } from "@/store";
const ComboBox = ({ service }) => {
  const [open, setOpen] = useState(true);
  const [subservices, setSubservices] = useState([]);
  const { language } = useStore();

  useEffect(() => {
    getSubSservices();
  }, [service]);

  const capitalize = (cadena) => {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
  };

  const getSubSservices = async () => {
    const id = service?.id?._id;
    SubserviceService.list({ id: id }).then((response) => {
      setSubservices(response.data.docs);
    });
  };

  return (
    <div className="w-full max-w-lg">
      <>
        <div
          className="text-black border border-greyText rounded-lg px-2 py-2 my-5 flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <h1 className="ml-3 text-lg">
            {capitalize(service?.id?.name[language])}
          </h1>
          <ArrowUpIcon
            color={"#5B78C7"}
            onClick={() => setOpen(!open)}
            className={!open ? "rotate-180" : ""}
          />
        </div>
        {open &&
          service?.subServices?.map((subservice, index) => (
            <div key={index} className="text-black flex justify-between px-4">
              <h1>{capitalize(subservice?.name[language])}</h1>
              <CheckOptionChecked />
            </div>
          ))}
      </>
    </div>
  );
};

export default ComboBox;
