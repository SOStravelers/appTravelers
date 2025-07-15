import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import InputText from "@/components/utils/inputs/InputText";
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
    return delay(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (service.canCancel) {
      const hasCancel = isBeforeHoursThreshold(
        service.startTime.isoTime,
        service.timeUntilCancel
      );
      setHasCancel(hasCancel);
    } else {
      setHasCancel(false);
    }
  }, [service]);

  useEffect(() => {
    if (!user) return;
    setName(
      user?.personalData?.name
        ? user?.personalData?.name?.first + " " + user?.personalData?.name?.last
        : ""
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

  const evaluateName = (name, change) => {
    setName(name);

    if (change) {
      if (name.length >= 4) {
        setErrName(null);
      }
    } else {
      if (name.length < 4) {
        setErrName(thisLanguage.nameInput.alert[language]);
      } else {
        setErrName(null);
      }
    }
  };

  const evaluateEmail = (email, change) => {
    setEmail(email);

    if (change) {
      if (email.length >= 4) {
        setErrEmail(null);
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrEmail(thisLanguage.emailInput.alert[language]);
      } else {
        setErrEmail(null);
      }
    }
  };
  const evaluatePhone = (val, isChange = false) => {
    const clean = val.replace(/\D/g, "");
    setPhone(clean);

    if (isChange) {
      if (/^[0-9]{6,15}$/.test(clean)) {
        setErrPhone(null);
      }
    } else {
      if (!/^[0-9]{6,15}$/.test(clean)) {
        setErrPhone(thisLanguage.phoneInput.alert[language]);
      } else {
        setErrPhone(null);
      }
    }
  };

  return (
    <>
      <div
        className={`px-6 flex flex-col items-center
    ${loading ? opacityAnimation : displayAnimation}
  `}
      >
        {/* Titulo */}
        <h1 className="text-md text-center  text-textColor font-bold mb-2">
          {thisLanguage.title[language]}
        </h1>
        {/* Subtitulo */}
        <div className="flex items-center ml-3 mb-2">
          <MdLock className="text-textColorGreen" size={20} />
          <h1 className="text-sm text-textColorGreen mt-1">
            {thisLanguage.subtitle[language]}
          </h1>
        </div>
        {/* CONTENEDOR */}
        <div className="bg-backgroundCard rounded-xl  px-3 py-3 shadow w-full max-w-md ">
          {/* Nombre */}
          <div className="mb-3">
            <label className="block text-xs text-textColor font-medium mb-2">
              {thisLanguage.nameInput.title[language]}
            </label>

            <InputText
              type="text"
              value={name}
              onChange={(e) => evaluateName(e.target.value, true)}
              onBlur={(e) => evaluateName(e.target.value, false)}
              placeholder="Eg: Neymar Jr"
              error={errName}
              className="w-full"
            />

            {errName ? (
              <p className="text-errorColor text-xs mt-1">{errName}</p>
            ) : (
              <div className="h-4" />
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-xs text-textColor font-medium mb-2">
              {thisLanguage.emailInput.title[language]}
            </label>

            <InputText
              type="email"
              value={email}
              disabled={user?.email}
              onChange={(e) => evaluateEmail(e.target.value, true)}
              onBlur={(e) => evaluateEmail(e.target.value, false)}
              placeholder="tucorreo@example.com"
              error={errEmail}
              className="w-full"
            />

            {errEmail ? (
              <p className="text-errorColor text-xs mt-1">{errEmail}</p>
            ) : (
              <div className="h-4" />
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
              setError={setErrCountry}
              inputClass={errCountry ? errInput : okInput}
              error={errCountry}
            />
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label className="block text-xs text-textColor  font-medium mb-2">
              {thisLanguage.phoneInput.title[language]}
            </label>
            <div className="flex gap-2">
              <PhoneCodeSelector phoneCode={phoneCode} inputClass={okInput} />

              <InputText
                type="number"
                value={phone}
                onChange={(e) => evaluatePhone(e.target.value, true)}
                onBlur={(e) => evaluatePhone(e.target.value, false)}
                className="w-full"
                error={errPhone}
              />
            </div>

            {errPhone ? (
              <p className="text-errorColor text-xs mt-1">{errPhone}</p>
            ) : (
              <div className="h-4" />
            )}
          </div>
        </div>
        {/* Aviso */}
        <h3 className="text-sm max-w-md text-textColorGray  mt-3 m-2">
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
