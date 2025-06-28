import { useState } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import CountrySelector from "@/components/utils/selector/CountrySelector";
import PhoneCodeSelector from "@/components/utils/selector/PhoneCodeSelector";
import languageData from "@/language/newSummary.json";
import BookingPopup from "@/components/ServicePreview/BookingPopup";
import { MdLock } from "react-icons/md";
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

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setErrName(languageData.contactInfo.nameInput.alert[language]);
      valid = false;
    } else setErrName(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrEmail(languageData.contactInfo.emailInput.alert[language]);
      valid = false;
    } else setErrEmail(null);

    if (!country) {
      setErrCountry(languageData.contactInfo.countryInput.alert[language]);
      valid = false;
    } else setErrCountry(null);

    if (!/^[0-9]{6,15}$/.test(phone)) {
      setErrPhone(languageData.contactInfo.phoneInput.alert[language]);
      valid = false;
    } else setErrPhone(null);

    if (valid) alert("Datos enviados correctamente");
  };

  return (
    <div className="min-h-screen py-4 px-6 bg-gray-50 flex flex-col ">
      <div className="h-12"></div>
      <h1 className="text-md text-center font-bold mb-2">
        {languageData.contactInfo.title[language]}
      </h1>
      <div className="flex items-center ml-3 mb-2">
        <MdLock className="text-green-700" size={20} />
        <h1 className="text-sm text-green-700  mt-1">
          {languageData.contactInfo.subtitle[language]}
        </h1>
      </div>

      <div className="bg-white rounded-xl  px-3 py-3 shadow w-full max-w-md overflow-hidden">
        {/* Nombre */}
        <div className="mb-3">
          <label className="block text-xs font-medium mb-2">
            {languageData.contactInfo.nameInput.title[language]}
          </label>
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
          <label className="block text-xs font-medium mb-2">
            {languageData.contactInfo.emailInput.title[language]}
          </label>
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
          <label className="block text-xs font-medium mb-2">
            {languageData.contactInfo.phoneInput.title[language]}
          </label>
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
      </div>

      <h3 className="text-sm text-gray-500  mt-3 m-2">
        {" "}
        {languageData.contactInfo.advice[language]}
      </h3>

      <BookingPopup
        priceLabel={`wena`}
        subtext={"hola"}
        tagLine={"chao"}
        buttonText={languageData.contactInfo.buttons.paymentButton[language]}
        onAction={validate}
      />

      {/* <button
        onClick={validate}
        className="block w-1/2 mx-auto bg-black text-white rounded-full py-2 text-sm mt-2 hover:opacity-90 transition"
      >
        {languageData.contactInfo.buttons.paymentButton[language]}
      </button> */}
    </div>
  );
}
