import { toast, Zoom, Flip, Slide, Bounce } from "react-toastify";

export const alertToast = ({
  type = "error", // "error" | "info" | "success" | "warning" | "default"
  message = "Error Server, try later",
  autoClose = 1000,
  position = toast.POSITION.TOP_CENTER,
  hideProgressBar = true,
  transition = Flip, // puedes pasar Flip | Slide | Bounce | Zoom
} = {}) => {
  const map = {
    error: toast.error,
    info: toast.info,
    success: toast.success,
    warning: toast.warn,
    warn: toast.warn,
    default: toast, // toast() simple
  };

  const fn = map[type] || map.error;

  fn(message, {
    position,
    autoClose,
    hideProgressBar,
    transition,
  });
};
