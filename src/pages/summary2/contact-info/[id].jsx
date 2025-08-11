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
import countries from "@/utils/countriesFull.json";

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

    const fullName = user?.personalData?.name
      ? `${user.personalData.name.first} ${user.personalData.name.last}`
      : "";
    setName(fullName);
    setEmail(user.email);
    setPhone(user.phone || "");

    let code = user.phoneCode?.trim() || "";
    let countryCode = user.phoneCountry || "";

    console.log("PHONE DEBUG", {
      phone: user.phone,
      code: code,
      countryCode: countryCode,
      match: countries.find((c) => c.dial_code === code),
    });

    if (countryCode) {
      setCountry(countryCode);
    } else if (code) {
      const match = countries.find((c) => c.dial_code === code);
      if (match) {
        setCountry(match.code);
        countryCode = match.code;
      }
    }

    if (code) setPhoneCode(code);
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
      localStorage.setItem("fromContactInfo", "true");
      setService({
        ...service,
        clientData: { name, email, country, phone, phoneCode },
      });
      router.push(`/stripe`);
    }
  };

  const evaluateName = (val, change) => {
    setName(val);
    if (change) {
      if (val.length >= 4) setErrName(null);
    } else {
      if (val.length < 4) setErrName(thisLanguage.nameInput.alert[language]);
      else setErrName(null);
    }
  };

  const evaluateEmail = (val, change) => {
    setEmail(val);
    if (change) {
      if (val.length >= 4) setErrEmail(null);
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        setErrEmail(thisLanguage.emailInput.alert[language]);
      else setErrEmail(null);
    }
  };

  const evaluatePhone = (val, change = false) => {
    const clean = val.replace(/\D/g, "");
    setPhone(clean);
    if (change) {
      if (/^[0-9]{6,15}$/.test(clean)) setErrPhone(null);
    } else {
      if (!/^[0-9]{6,15}$/.test(clean))
        setErrPhone(thisLanguage.phoneInput.alert[language]);
      else setErrPhone(null);
    }
  };

  return (
    <>
      <div
        className={`px-6 flex flex-col items-center ${
          loading ? opacityAnimation : displayAnimation
        }`}
      >
        <h1 className="text-md text-center text-textColor font-bold mb-2">
          {thisLanguage.title[language]}
        </h1>

        <div className="flex items-center ml-3 mb-2">
          <MdLock className="text-textColorGreen" size={20} />
          <h1 className="text-sm text-textColorGreen mt-1">
            {thisLanguage.subtitle[language]}
          </h1>
        </div>

        <div className="bg-backgroundCard rounded-xl px-3 py-3 shadow w-full max-w-md">
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
              placeholder="Ej: Neymar Jr"
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
            <label className="block text-xs text-textColor font-medium mb-2">
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

        <h3 className="text-sm max-w-md text-textColorGray mb-24 mt-3 m-2">
          {thisLanguage.advice[language]}
        </h3>
      </div>

      <BookingPopup
        priceLabel={`${thisLanguage.value[language]} ${formatPrice(
          service?.totalPrice || null,
          currency
        )}`}
        subtext=""
        tagLine={hasCancel?.isBefore ? thisLanguage.cancel[language] : ""}
        buttonText={thisLanguage.buttons.paymentButton[language]}
        onAction={validate}
      />
    </>
  );
}
