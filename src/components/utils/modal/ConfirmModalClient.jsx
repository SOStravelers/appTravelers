// components/utils/FilterModal.jsx
import { useStore } from "@/store";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";

export default function ConfirmModalClient({
  isOpen,
  onClose,
  onApply,
  title,
  body,
  apply,
}) {
  const { language, currency } = useStore();

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50
        transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      <div
        className={`bg-backgroundModal rounded-xl w-full max-w-md p-4 mx-8 transform transition-all relative
    ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-textColorGray text-lg hover:text-textColor transition-colors"
        >
          ✕
        </button>

        {/* header */}
        <div className="mb-3 mx-1">
          <h3 className="text-md text-textColor font-semibold">{title}</h3>
        </div>

        {/* body */}
        <div className="space-y-4 text-textColorGray">
          <p className="text-sm mb-12 mt-8 mx-3">{body}</p>

          <OutlinedButton
            onClick={onApply}
            text={apply || "Confirm"}
            px={0}
            py="py-2"
            dark="darkHeavy"
            textSize="text-xs"
            textColor="text-white"
            buttonCenter={true}
          />
        </div>
      </div>
    </div>
  );
}
