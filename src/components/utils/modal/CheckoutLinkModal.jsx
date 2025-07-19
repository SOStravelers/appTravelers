import { useEffect } from "react";
import { FaRegCopy, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CheckoutLinkModal({ isOpen, onClose, url }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copiado al portapapeles", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1500,
      });
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-backgroundModal rounded-xl w-full max-w-md p-6 mx-4 transform transition-all ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg text-textColor font-semibold">
            Link generado con éxito
          </h3>
          <button onClick={onClose} className="text-textColorGray text-lg">
            ✕
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-backgroundCard p-4 rounded-lg text-sm">
          <p className="mb-2 text-textColorGray">
            Puedes compartir este link con tu cliente:
          </p>
          <div className="flex items-center justify-between bg-white dark:bg-black border border-gray-300 rounded-lg px-3 py-2">
            <span className="truncate text-xs text-textColor">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            </span>
            <button onClick={copyToClipboard} className="ml-2 text-textColor">
              <FaRegCopy size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-textColorGray">
            Puedes cerrar esta ventana o copiar el link para enviarlo
            manualmente.
          </p>
        </div>
      </div>
    </div>
  );
}
