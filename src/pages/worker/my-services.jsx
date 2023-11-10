import { useState, useEffect } from "react";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import TextModal from "@/components/utils/modal/TextModal";
import ComboBox from "@/components/utils/combobox/ComboBox";
import ComboBoxEditable from "@/components/utils/combobox/ComboBoxEditable";
import ServiceService from "@/services/ServiceService";
import UserService from "@/services/UserService";
import { useStore } from "@/store";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(true);
  const [addingService, setAddingService] = useState(false);

  const { user, setUser } = useStore();

  useEffect(() => {
    if (user?.businessDate?.services?.length > 0) {
      setSelectedOptions(user?.businessDate?.services);
    }
    getData();
  }, [user]);

  useEffect(() => {
    console.log(selectedOptions);
    selectedOptions?.map((s) => {
      if (s?.subServices?.length === 0) {
        setSelectedOptions(selectedOptions?.filter((ss) => ss?.id !== s?.id));
      }
    });
  }, [selectedOptions]);

  const getData = async () => {
    ServiceService.list({ isActive: true, page: 1 }).then((response) => {
      setServices(response.data.docs);
    });
  };
  /* Sugerencia de codigo
  const handleChange = (
    serviceId,
    serviceName,
    subserviceId,
    subserviceName
  ) => {
    const serviceExists = selectedOptions?.find(
      (s) => s?.serviceId === serviceId
    );
    if (serviceExists) {
      const subserviceExists = serviceExists?.subServices?.find(
        (s) => s?.subserviceId === subserviceId
      );
      if (subserviceExists) {
        const newSelectedOptions = selectedOptions?.map((s) => {
          if (s?.serviceId === serviceId) {
            const newSubservices = s?.subServices?.filter(
              (ss) => ss?.subserviceId !== subserviceId
            );
            return { ...s, subServices: newSubservices };
          } else {
            return s;
          }
        });
        setSelectedOptions(newSelectedOptions);
      } else {
        const newSelectedOptions = selectedOptions?.map((s) => {
          if (s?.serviceId === serviceId) {
            const newSubservices = [
              ...s?.subServices,
              { subserviceId: subserviceId, subserviceName: subserviceName },
            ];
            return { ...s, subServices: newSubservices };
          } else {
            return s;
          }
        });
        setSelectedOptions(newSelectedOptions);
      }
    } else {
      setSelectedOptions([
        ...selectedOptions,
        {
          serviceId: serviceId,
          serviceName: serviceName,
          subServices: [
            { subserviceId: subserviceId, subserviceName: subserviceName },
          ],
        },
      ]);
    }
  };
*/

  const handleChange = (serviceId, subserviceId) => {
    const serviceExists = selectedOptions?.find((s) => s?.id === serviceId);
    if (serviceExists) {
      const subserviceExists = serviceExists?.subServices?.find(
        (s) => s === subserviceId
      );
      if (subserviceExists) {
        const newSelectedOptions = selectedOptions?.map((s) => {
          if (s?.id === serviceId) {
            const newSubservices = s?.subServices?.filter(
              (ss) => ss !== subserviceId
            );
            return { ...s, subServices: newSubservices };
          } else {
            return s;
          }
        });
        setSelectedOptions(newSelectedOptions);
      } else {
        const newSelectedOptions = selectedOptions?.map((s) => {
          if (s?.id === serviceId) {
            const newSubservices = [...s?.subServices, subserviceId];
            return { ...s, subServices: newSubservices };
          } else {
            return s;
          }
        });
        setSelectedOptions(newSelectedOptions);
      }
    } else {
      const newService = {
        id: serviceId,
        subServices: [subserviceId],
      };
      setSelectedOptions([...selectedOptions, newService]);
    }
  };

  const handleSaveSelection = async () => {
    user.workerData.services = selectedOptions;
    console.log(user);
    const response = await UserService.updateUser(user);
    console.log("weno", user);
    if (response.data) {
      console.log("respesta", response.data);
      setUser(response.data);
    }
    console.log(user);
    setUser(response.data);
    setAddingService(false);
  };

  const handleAddService = () => {
    setAddingService(true);
    //getData();
  };

  return (
    <div className="py-28 px-5 md:pl-80">
      {user?.workerData?.services?.length === 0 && !addingService && (
        <>
          <p className="py-20 text-center max-w-lg">No services register yet</p>
          <OutlinedButton
            text="Add services"
            onClick={() => handleAddService()}
          />
        </>
      )}
      {user?.workerData?.services?.length > 0 && !addingService && (
        <>
          {user?.workerData?.services?.map((service) => (
            <ComboBox
              key={service?.id}
              service={service}
              title={services?.filter((s) => s?.id === service?.id)[0]?.name}
              selectedOptions={selectedOptions}
              handleChange={handleChange}
            />
          ))}
          <OutlinedButton
            text="Edit/Add services"
            onClick={() => handleAddService()}
          />
        </>
      )}
      {addingService && (
        <>
          {services?.length > 0 &&
            services?.map((service) => (
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
        title={`An administrator can modify enrolled services, including the ability to add or remove services or subservices.`}
        text={[]}
        buttonText="Continue"
        onAccept={() => setOpen(false)}
      />
    </div>
  );
}
