import { useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import CountrySelector from "@/components/utils/selector/CountrySelector";
import PhoneCodeSelector from "@/components/utils/selector/PhoneCodeSelector";

const okInput =
  "w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-gray-500 transition";
const errInput =
  "w-full border border-red-500 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-red-600 transition";

export default function PersonalInfoPage() {
  const { language } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");

  const [errName, setErrName] = useState(null);
  const [errEmail, setErrEmail] = useState(null);
  const [errCountry, setErrCountry] = useState(null);
  const [errPhone, setErrPhone] = useState(null);

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const labels = {
    es: {
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
    },
    en: { name: "Name", email: "Email", phone: "Phone" },
    pt: { name: "Nome", email: "Email", phone: "Telefone" },
    fr: { name: "Nom", email: "Email", phone: "Téléphone" },
    de: { name: "Name", email: "E-Mail", phone: "Telefon" },
  };
  const t = labels[language] || labels.en;

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setErrName("Campo obligatorio");
      valid = false;
    } else setErrName(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrEmail("Correo no válido");
      valid = false;
    } else setErrEmail(null);

    if (!country) {
      setErrCountry("Selecciona un país");
      valid = false;
    } else setErrCountry(null);

    if (!/^[0-9]{6,15}$/.test(phone)) {
      setErrPhone("Teléfono inválido");
      valid = false;
    } else setErrPhone(null);

    if (valid) alert("Datos enviados correctamente");
  };

  return (
    <div className="min-h-screen p-4 ">
      <div className="h-12"></div>

      {/* Nombre */}
      <div className="mb-3">
        <label className="block text-xs font-medium mb-2">{t.name}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errName ? errInput : okInput}
        />
        {errName && <p className="text-red-600 text-xs mt-1">{errName}</p>}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block text-xs font-medium mb-2">{t.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errEmail ? errInput : okInput}
        />
        {errEmail && <p className="text-red-600 text-xs mt-1">{errEmail}</p>}
      </div>

      {/* País */}
      <div className="mb-3">
        <CountrySelector
          language={language}
          country={country}
          setCountry={setCountry}
          setPhoneCode={setPhoneCode}
          dropdownOpen={countryDropdownOpen}
          setDropdownOpen={setCountryDropdownOpen}
          inputClass={errCountry ? errInput : okInput}
          error={errCountry}
        />
      </div>

      {/* Teléfono */}
      <div className="mb-3">
        <label className="block text-xs font-medium mb-2">{t.phone}</label>
        <div className="flex gap-2">
          <PhoneCodeSelector phoneCode={phoneCode} inputClass={okInput} />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className={`flex-1 ${errPhone ? errInput : okInput}`}
          />
        </div>
        {errPhone && <p className="text-red-600 text-xs mt-1">{errPhone}</p>}
      </div>

      <button
        onClick={validate}
        className="block w-1/2 mx-auto bg-black text-white rounded-full py-2 text-sm mt-2 hover:opacity-90 transition"
      >
        Enviar
      </button>
    </div>
  );
}
