import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import InputText from "@/components/utils/inputs/InputText";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import languageData from "@/language/personalDetails.json";

export default function EditNameModal({
  isOpen,
  onClose,
  onSave,
  defaultName,
}) {
  const { language } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(defaultName || "");
      setError("");
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen, defaultName]);

  const handleSave = async (newName) => {
    const [first, ...rest] = newName.trim().split(" ");
    const last = rest.join(" ");

    const personalData = {
      name: {
        first: capitalize(first),
        last: capitalize(last),
      },
    };

    try {
      const response = await UserService.updateUser({ personalData });

      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("auth.user", JSON.stringify(response.data.user));
        Cookies.set("auth.user", JSON.stringify(response.data.user));
        toast.success("Nombre guardado");
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      toast.error("Error al guardar el nombre");
    }

    setModalOpen(false);
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
        className={`bg-white rounded-xl w-full max-w-md p-4 mx-4 transform transition-all ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg text-textColor font-semibold">
            {languageData.name[language]}
          </h3>
          <button onClick={onClose} className="text-textColorGray text-lg">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <InputText
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Juan Pérez"
            error={error}
            className="w-full"
          />
          {error && <p className="text-errorColor text-xs">{error}</p>}
          <OutlinedButton
            text={languageData.saveChanges[language]}
            onClick={handleSave}
            px={0}
            py={2}
            textSize="text-sm"
            textColor="text-white"
            buttonCenter={true}
          />
        </div>
      </div>
    </div>
  );
}
