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
        onClick={(e) => e.stopPropagation()}
        className={`bg-backgroundModal rounded-xl w-full max-w-md p-4  mx-8 transform transition-all
          ${
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 translate-y-4"
          }`}
      >
        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md text-textColor font-semibold">{title}</h3>
          <button onClick={onClose} className="text-textColorGray text-md">
            ✕
          </button>
        </div>

        {/* body */}
        <div className="space-y-4 text-textColorGray ">
          <p className="text-sm mb-12 mt-8">{body}</p>

          {/* apply */}

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
