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
import { toast } from "react-toastify";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [open, setOpen] = useState(true);
  const [addingService, setAddingService] = useState(false);
  const [isActiveInitial, setIsActiveInitial] = useState(null);
  const { isWorker } = useStore();
  const [user, setUser] = useState({});

  useEffect(() => {
    getData();
    getUserData();
  }, []);

  /* useEffect(() => {
    selectedOptions?.map((s) => {
      if (s?.subServices?.length === 0) {
        setSelectedOptions(selectedOptions?.filter((ss) => ss?.id !== s?.id));
      }
    });
  }, [services]); 

  useEffect(() => {
    selectedOptions?.map((s) => {
      if (s?.subServices?.length === 0) {
        setSelectedOptions(selectedOptions?.filter((ss) => ss?.id !== s?.id));
      }
    });
  }, [selectedOptions]);

   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newUser = await UserService.getUserByToken();
        setUser(newUser.data);

        // Ahora que tenemos el usuario, podemos obtener activeVal
        setIsActiveInitial(newUser.data?.workerData?.isActive);
      } catch (err) {
        setUser({});
        setIsActiveInitial(false);
      }
    };
    fetchData();
  }, []);

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
    try {
      // Filtrar los servicios que tienen al menos un subservicio
      const servicesWithSubservices = selectedOptions.filter(
        (service) => service.subServices.length > 0
      );
      user.workerData.services = servicesWithSubservices;
      const response = await UserService.updateUser(user);
      toast.info(isWorker ? "alterações salvas" : "Saved.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });

      if (response.data) {
        setUser(response.data);
      }

      // Chequear array de subservicios para actualizar la base de datos
      if (servicesWithSubservices.length > 0 && isActiveInitial) {
        await UserService.readyToWork({
          isMyServicesOk: true,
          isActive: true,
        });
      } else if (servicesWithSubservices.length > 0) {
        await UserService.readyToWork({ isMyServicesOk: true });
      } else {
        await UserService.readyToWork({
          isMyServicesOk: false,
          isActive: false,
        });
      }

      setAddingService(false);
    } catch (err) {
      toast.error("Internal Server Error. Please try again later.", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1800,
      });
    }
  };

  const handleAddService = () => {
    setAddingService(true);
    //getData();
  };

  return (
    <div className="py-20 lg:py-24 xl:py-24 px-5 md:pl-80">
      {selectedOptions?.length === 0 && !addingService && (
        <>
          <p className="pb-20  pt-10 text-center max-w-lg">
            {isWorker
              ? "Nenhum serviço registrado ainda"
              : "No services register yet"}
          </p>
          <BarberPicture className="mb-6 px-20" />
          <OutlinedButton
            margin="my-10"
            text={isWorker ? "Adicionar serviços" : "Add services"}
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
            text={isWorker ? "Editar/Adicionar serviços" : "Edit/Add services"}
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
            text={isWorker ? "Salvar seleção" : "Save Selection"}
            onClick={() => handleSaveSelection()}
            margin="my-10"
          />
        </>
      )}
      <TextModal
        open={open}
        setOpen={setOpen}
        title={
          isWorker
            ? "Um administrador pode modificar serviços inscritos, incluindo a capacidade de adicionar ou remover serviços ou subserviços."
            : `An administrator can modify enrolled services, including the ability to add or remove services or subservices.`
        }
        text={[]}
        buttonText={isWorker ? "Continuar" : "Continue"}
        onAccept={() => setOpen(false)}
      />
    </div>
  );
}
