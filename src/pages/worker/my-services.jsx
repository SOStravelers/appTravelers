import { useState, useEffect } from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import ComboBox from "@/components/utils/combobox/ComboBox";
import ComboBoxEditable from "@/components/utils/combobox/ComboBoxEditable";
import { SERVICES_OPTIONS } from "@/constants";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(true);
  const [addingService, setAddingService] = useState(false);

  const handleChange = (value) => {
    setSelectedOptions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleSaveSelection = () => {
    setServices(selectedOptions);
    setAddingService(false);
  };

  return (
    <div className="py-28 px-5 md:pl-80">
      {services?.length === 0 && !addingService && (
        <>
          <p className="py-20 text-center max-w-lg">No services register yet</p>
          <OutlinedButton
            text="Add services"
            onClick={() => setAddingService(true)}
          />
        </>
      )}
      {services?.length > 0 && !addingService && (
        <>
          {SERVICES_OPTIONS?.map((service) => (
            <ComboBox
              key={service?.id}
              service={service}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              handleChange={handleChange}
            />
          ))}
          <OutlinedButton
            text="Edit services"
            onClick={() => setAddingService(true)}
          />
        </>
      )}
      {addingService && (
        <>
          {SERVICES_OPTIONS?.map((service) => (
            <ComboBoxEditable
              key={service?.id}
              service={service}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              handleChange={handleChange}
            />
          ))}
          <OutlinedButton
            text="Save Selection"
            onClick={() => handleSaveSelection()}
          />
        </>
      )}
      <TextModal
        open={open}
        setOpen={setOpen}
        title="An administrator can modify enrolled services, including the ability to add or remove services or subservices."
        buttonText="Continue"
        onAccept={() => setOpen(false)}
      />
    </div>
  );
}
