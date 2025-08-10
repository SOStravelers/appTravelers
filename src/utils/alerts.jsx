import { toast, Zoom, Flip, Slide, Bounce } from "react-toastify";
export const alertError = ({
  message = "Error to change, try later",
  autoClose = 1000,
}) => {
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose,
    hideProgressBar: true,
    transition: Flip,
  });
};
