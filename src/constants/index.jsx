import languageData from "@/language/routeTitles.json";
import { useStore } from "@/store";

// Constantes independientes
export const SECTION_ONE = 1;
export const SECTION_TWO = 2;
export const SECTION_THREE = 3;
export const SECTION_FOUR = 4;

export const WEEK_DAYS = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

export const SERVICES_OPTIONS = [
  {
    servicio: "Servicios de Peluquería",
    subservicios: [
      { id: 1, name: "Corte de pelo caballero" },
      { id: 2, name: "Corte de pelo dama" },
      { id: 3, name: "Corte de pelo niños" },
      { id: 4, name: "Corte de barba" },
    ],
  },
  {
    servicio: "Servicios de Manicura",
    subservicios: [
      { id: 5, name: "Manicura" },
      { id: 6, name: "Pedicura" },
    ],
  },
];

// Función para obtener títulos dinámicos basados en el idioma
export const getRouteTitles = (language) => ({
  subservices: languageData.selectSubservices[language],
  "select-hostel": languageData.selectPlace[language],
  reservation: languageData.reservations[language],
  "workers-found": languageData.partnersFound[language],
  summary: languageData.summary[language],
  payment: languageData.paymentMethods[language],
  "service-history": languageData.serviceHistory[language],
  settings: languageData.settings[language],
  notifications: languageData.notifications[language],
  "payment-demo": "Reserva concluída",
  "my-services": languageData.myServices[language],
  "personal-details": languageData.personalDetails[language],
  "worker/profile-config": "My Worker Profile",
  "my-schedules": languageData.mySchedule[language],
  "worker/edit": languageData.aboutMe[language],
  "terms-of-service": languageData.termsOfService[language],
  "use-policy": languageData.usePolicy[language],
  "service-details": languageData.bookingDetails[language],
  chat: languageData.chat[language],
  "config/subservice": "Config Subservicio",
  "config/subservice/info": "Config Subserv - Info",
  "config/subservice/gallery": "Config Subserv - Gallery",
  "config/subservice/create": "Config Subserv - Create",
});

// Hook para obtener el idioma dinámicamente
export const useDynamicRouteTitles = () => {
  const { language } = useStore();
  return getRouteTitles(language);
};
