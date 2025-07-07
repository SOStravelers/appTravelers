import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { formatPrice, isBeforeHoursThreshold } from "@/utils/format";
import CountrySelector from "@/components/utils/selector/CountrySelector";
import PhoneCodeSelector from "@/components/utils/selector/PhoneCodeSelector";
import languageData from "@/language/newSummary.json";
import BookingPopup from "@/components/ServicePreview/BookingPopup";
import { MdLock } from "react-icons/md";
const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

const okInput = `w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-blueBorder transition ${disabledStyles}`;

const errInput = `w-full border border-red-500 bg-gray-100 rounded-md px-3 py-3 text-sm focus:outline-none focus:border-red-600 transition ${disabledStyles}`;

export default function ContactInfoPage() {
  const { language, user, service, setService, currency } = useStore();
  const thisLanguage = languageData.contactInfo;
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [hasCancel, setHasCancel] = useState(false);
  const [errName, setErrName] = useState(null);
  const [errEmail, setErrEmail] = useState(null);
  const [errCountry, setErrCountry] = useState(null);
  const [errPhone, setErrPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    delay(250, () => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (service.canCancel) {
      const hasCancel = isBeforeHoursThreshold(
        service.startTime.isoTime,
        service.timeUntilCancel
      );
      console.log("hasCancel", hasCancel);
      setHasCancel(hasCancel);
    } else {
      setHasCancel(false);
    }
  }, [service]);

  useEffect(() => {
    console.log("hola", user);
    if (!user) return;
    setName(
      user?.personalData?.name?.first + " " + user?.personalData?.name?.last
    );
    setEmail(user?.email);
  }, [user]);

  const validate = () => {
    let valid = true;
    if (!name.trim()) {
      setErrName(thisLanguage.nameInput.alert[language]);
      valid = false;
    } else setErrName(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrEmail(thisLanguage.emailInput.alert[language]);
      valid = false;
    } else setErrEmail(null);

    if (!country) {
      setErrCountry(thisLanguage.countryInput.alert[language]);
      valid = false;
    } else setErrCountry(null);

    if (!/^[0-9]{6,15}$/.test(phone)) {
      setErrPhone(thisLanguage.phoneInput.alert[language]);
      valid = false;
    } else setErrPhone(null);

    if (valid) {
      setService({
        ...service,
        clientData: { name, email, country, phone, phoneCode },
      });
      router.push(`/stripe`);
    }

    // if (valid) alert("Datos enviados correctamente");
  };

  return (
    <>
      <div
        className={`min-h-screen bg-gray-50 pt-4 px-6  flex flex-col items-center
          ${loading ? opacityAnimation : displayAnimation}
        `}
      >
        {/* Titulo */}
        <h1 className="text-md text-center font-bold mb-2">
          {thisLanguage.title[language]}
        </h1>
        {/* Subtitulo */}
        <div className="flex items-center ml-3 mb-2">
          <MdLock className="text-green-700" size={20} />
          <h1 className="text-sm text-green-700  mt-1">
            {thisLanguage.subtitle[language]}
          </h1>
        </div>
        {/* CONTENEDOR */}
        <div className="bg-white rounded-xl  px-3 py-3 shadow w-full max-w-md ">
          {/* Nombre */}
          <div className="mb-3">
            <label className="block text-xs font-medium mb-2">
              {thisLanguage.nameInput.title[language]}
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
              {thisLanguage.emailInput.title[language]}
            </label>
            <input
              disabled={user?.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errEmail ? errInput : okInput}
            />
            {errEmail && (
              <p className="text-red-600 text-xs mt-1">{errEmail}</p>
            )}
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
              {thisLanguage.phoneInput.title[language]}
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
            {errPhone && (
              <p className="text-red-600 text-xs mt-1">{errPhone}</p>
            )}
          </div>
        </div>
        {/* Aviso */}
        <h3 className="text-sm max-w-md text-gray-500 mb-32 mt-3 m-2">
          {" "}
          {thisLanguage.advice[language]}
        </h3>
      </div>
      {/* Botón */}
      <BookingPopup
        priceLabel={`${thisLanguage.value[language]} ${formatPrice(
          service?.selectedData?.totalPrice || null,
          currency
        )} `}
        subtext={""}
        tagLine={hasCancel?.isBefore ? thisLanguage.cancel[language] : ""}
        onAction={validate}
      />
    </>
  );
}
