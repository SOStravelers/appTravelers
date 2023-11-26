import { useState, useEffect } from "react";
import SubserviceService from "@/services/SubserviceService";
import SectionWeek from "@/components/myHollidays/SectionWeek";
import { CheckOptionChecked, ArrowUpIcon } from "@/constants/icons";

const ComboBoxService = ({ service, title }) => {
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

  return (
    <div className="w-full max-w-lg">
      <>
        <div
          className="text-black border border-greyText rounded-lg px-2 py-2 my-5 flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <h1>{title}</h1>
          <ArrowUpIcon
            color={"#5B78C7"}
            onClick={() => setOpen(!open)}
            className={open ? "rotate-180" : ""}
          />
        </div>
        {open && (
          <div
            className="text-black flex justify-between px-5"
          >
            <SectionWeek />
          </div>
        )}
      </>
    </div>
  );
};

export default ComboBoxService;
