import { useState, useEffect } from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import ComboBox from "@/components/utils/combobox/ComboBox";
import ComboBoxEditable from "@/components/utils/combobox/ComboBoxEditable";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import WorkerService from "@/services/WorkerService";
import { useStore } from "@/store";
import { BarberPicture } from "@/constants/icons";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(true);
  const [addingService, setAddingService] = useState(false);

  const { user, setUser } = useStore();

  useEffect(() => {
    getData();
    getUserData();
  }, [user]);

  useEffect(() => {
    /*selectedOptions?.map((s) => {
      if (s?.subServices?.length === 0) {
        setSelectedOptions(selectedOptions?.filter((ss) => ss?.id !== s?.id));
      }
    });*/
  }, [services]);

  useEffect(() => {
    /*selectedOptions?.map((s) => {
      if (s?.subServices?.length === 0) {
        setSelectedOptions(selectedOptions?.filter((ss) => ss?.id !== s?.id));
      }
    });*/
  }, [selectedOptions]);

  const getData = async () => {
    ServiceService.listServices().then((response) => {
      setServices(response.data);
    });
  };

  const getUserData = async () => {
    const response = await WorkerService.getWorkerServices();
    if (response?.data) {
      setSelectedOptions(response.data);
    }
  };

  const handleChange = (service, subservice) => {
    const serviceExists = selectedOptions?.find(
      (s) => s?.id?._id === service._id
    );
    if (serviceExists) {
      const subserviceExists = serviceExists?.subServices?.find(
        (s) => s._id === subservice._id
      );
      if (subserviceExists) {
        const newSelectedOptions = selectedOptions?.map((s) => {
          if (s?.id?._id === service._id) {
            const newSubservices = s?.subServices?.filter(
              (ss) => ss._id !== subservice._id
            );
            return { ...s, subServices: newSubservices, gallery: [] };
          } else {
            return s;
          }
        });
        setSelectedOptions(newSelectedOptions);
      } else {
        const newSelectedOptions = selectedOptions?.map((s) => {
          if (s?.id?._id === service._id) {
            const newSubservices = [...s?.subServices, subservice];
            return { ...s, subServices: newSubservices, gallery: [] };
          } else {
            return s;
          }
        });
        setSelectedOptions(newSelectedOptions);
      }
    } else {
      const newService = {
        id: {
          _id: service?._id,
          name: service?.name,
        },
        subServices: [subservice],
        gallery: [],
      };

      setSelectedOptions([...selectedOptions, newService]);
    }
  };

  const handleSaveSelection = async () => {
    // Filtrar los servicios que tienen al menos un subservicio
    const servicesWithSubservices = selectedOptions.filter(
      (service) => service.subServices.length > 0
    );

    user.workerData.services = servicesWithSubservices;

    // Chequear array de subservicios para actualizar la base de datos
    user.workerData.isMyServicesOk = servicesWithSubservices.length > 0;

    const response = await UserService.updateUser(user);

    if (response.data) {
      setUser(response.data);
    }

    setAddingService(false);
  };

  const handleAddService = () => {
    setAddingService(true);
    //getData();
  };

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      {selectedOptions?.length === 0 && !addingService && (
        <>
          <p className="pb-20 pt-10 text-center max-w-lg">
            No services register yet
          </p>
          <BarberPicture className="mb-6" />
          <OutlinedButton
            margin="my-10"
            text="Add services"
            onClick={() => handleAddService()}
          />
        </>
      )}
      {selectedOptions?.length > 0 && !addingService && (
        <>
          {selectedOptions?.map((service, index) => (
            <ComboBox
              key={index}
              service={service}
              selectedOptions={selectedOptions}
            />
          ))}
          <OutlinedButton
            text="Edit/Add services"
            margin="my-10"
            onClick={() => handleAddService()}
          />
        </>
      )}
      {addingService && (
        <>
          {services?.length > 0 &&
            services?.map((service, index) => (
              <ComboBoxEditable
                key={index}
                service={service}
                selectedOptions={selectedOptions}
                handleChange={handleChange}
              />
            ))}
          <OutlinedButton
            text="Save Selection"
            onClick={() => handleSaveSelection()}
            margin="my-10"
          />
        </>
      )}
      <TextModal
        open={open}
        setOpen={setOpen}
        title={`An administrator can modify enrolled services, including the ability to add or remove services or subservices.`}
        text={[]}
        buttonText="Continue"
        onAccept={() => setOpen(false)}
      />
    </div>
  );
}
