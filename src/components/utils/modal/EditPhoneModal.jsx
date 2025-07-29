import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import CountrySelector from "@/components/utils/selector/CountrySelector";
import PhoneCodeSelector from "@/components/utils/selector/PhoneCodeSelector";
import InputText from "@/components/utils/inputs/InputText";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import UserService from "@/services/UserService";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import languageData from "@/language/personalDetails.json";
import countries from "@/utils/countriesFull.json";

export default function EditPhoneModal({ isOpen, onClose }) {
  const { user, setUser, language } = useStore();

  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const okInput = `w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-blueBorder transition`;
  const errInput = `w-full border border-red-500 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-red-600 transition`;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setPhone(user?.phone || "");
      setPhoneCode(user?.phoneCode || "+1");
      setCountry(user?.phoneCountry || "");

      // Intentar inferir país desde código si no está
      if (!user?.phoneCountry && user?.phoneCode) {
        const match = countries.find((c) => c.dial_code === user.phoneCode);
        if (match) setCountry(match.code);
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleSave = async () => {
    const cleaned = phone.replace(/\D/g, "");

    if (!country || !/^[0-9]{6,15}$/.test(cleaned)) {
      setError(languageData.phoneInput.alert[language]);
      return;
    }

    const personalData = {
      phone: cleaned,
      phoneCode,
      phoneCountry: country,
    };

    try {
      const response = await UserService.updateUser({ personalData });

      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("auth.user", JSON.stringify(response.data.user));
        Cookies.set("auth.user", JSON.stringify(response.data.user));
        toast.success(languageData.phoneSaved[language] || "Teléfono guardado");
        onClose();
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      toast.error("Error al guardar el teléfono");
    }
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
            {languageData.phone[language]}
          </h3>
          <button onClick={onClose} className="text-textColorGray text-lg">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <CountrySelector
            language={language}
            country={country}
            setCountry={setCountry}
            setPhoneCode={setPhoneCode}
            dropdownOpen={false}
            setDropdownOpen={() => {}}
            setError={setError}
            inputClass={error ? errInput : okInput}
            error={error}
          />

          <div className="flex gap-2">
            <PhoneCodeSelector phoneCode={phoneCode} inputClass={okInput} />
            <InputText
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full"
              error={error}
            />
          </div>

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
