import { useState, useRef, useEffect } from "react";
import countries from "@/utils/countries.json";
import { useStore } from "@/store";
import { FaChevronDown } from "react-icons/fa";

const okInput =
  "w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-gray-500 transition";
const errInput =
  "w-full border border-red-500 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-red-600 transition";

export default function PersonalInfoForm() {
  const { language } = useStore();

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
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);

  const countryRef = useRef();
  const codeRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target))
        setCountryDropdownOpen(false);
      if (codeRef.current && !codeRef.current.contains(e.target))
        setCodeDropdownOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const labels = {
    es: {
      name: "Nombre",
      email: "Correo electrónico",
      country: "País",
      phone: "Teléfono",
    },
    en: {
      name: "Name",
      email: "Email",
      country: "Country",
      phone: "Phone",
    },
    pt: {
      name: "Nome",
      email: "Email",
      country: "País",
      phone: "Telefone",
    },
    fr: {
      name: "Nom",
      email: "Email",
      country: "Pays",
      phone: "Téléphone",
    },
    de: {
      name: "Name",
      email: "E-Mail",
      country: "Land",
      phone: "Telefon",
    },
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
    <div className="max-w-md mx-auto space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-xs font-medium">{t.name}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errName ? errInput : okInput}
        />
        {errName && <p className="text-red-600 text-xs mt-1">{errName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium">{t.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errEmail ? errInput : okInput}
        />
        {errEmail && <p className="text-red-600 text-xs mt-1">{errEmail}</p>}
      </div>

      {/* País */}
      <div ref={countryRef} className="relative">
        <label className="block text-xs font-medium">{t.country}</label>
        <div
          onClick={() => setCountryDropdownOpen((p) => !p)}
          className={`relative ${
            errCountry ? errInput : okInput
          } cursor-pointer flex items-center justify-between`}
        >
          <span>{country || "Seleccionar"}</span>
          <FaChevronDown className="text-xs" />
        </div>
        {countryDropdownOpen && (
          <div className="absolute z-20 w-full max-h-60 overflow-auto mt-1 bg-white border border-gray-300 rounded-md shadow">
            {countries.map((c) => (
              <div
                key={c.code}
                onClick={() => {
                  setCountry(c.name[language] || c.name.en);
                  setCountryDropdownOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <span>{c.emoji}</span>
                <span>{c.name[language] || c.name.en}</span>
              </div>
            ))}
          </div>
        )}
        {errCountry && (
          <p className="text-red-600 text-xs mt-1">{errCountry}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-medium">{t.phone}</label>
        <div className="flex gap-2">
          {/* Código telefónico */}
          <div ref={codeRef} className="relative w-28">
            <div
              onClick={() => setCodeDropdownOpen((p) => !p)}
              className={`relative ${okInput} cursor-pointer flex items-center justify-between`}
            >
              <span>{phoneCode}</span>
              <FaChevronDown className="text-xs" />
            </div>
            {codeDropdownOpen && (
              <div className="absolute z-20 w-full max-h-60 overflow-auto mt-1 bg-white border border-gray-300 rounded-md shadow">
                {countries.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => {
                      setPhoneCode(c.dial_code);
                      setCodeDropdownOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <span>{c.emoji}</span>
                    <span>{c.dial_code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input número */}
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
        className="mt-4 bg-black text-white w-full py-3 rounded-md hover:opacity-90 transition"
      >
        Enviar
      </button>
    </div>
  );
}
