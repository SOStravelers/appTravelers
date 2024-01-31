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

// routeTitles.js
export const routeTitles = {
  subservices: "Select Subservices",
  "select-hostel": "Select Hostel",
  reservation: "Reservation",
  "workers-found": "Workers Found",
  summary: "Summary",
  payment: "Payment Method",
  "service-history": "Service History",
  settings: "Settings",
  notifications: "Notifications",
  "payment-demo": "Reserva concluída",
  "my-services": "My Services",
  "personal-details": "Personal Details",
  "worker/profile-config": "My Worker Profile",
  "my-schedules": "My Schedule",
  "worker/edit": "About Me",
  "terms-of-service": "Terms of service",
  "use-policy": "Use Policy",
  "service-details": "Booking Details",
  chat: "Chat",
};
