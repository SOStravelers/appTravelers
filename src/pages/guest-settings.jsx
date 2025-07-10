import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import Select from "react-select";
import OptionCard from "@/components/utils/cards/OptionCard";
import OptionSwitch from "@/components/utils/switch/OptionSwitch";
import OutlinedButton from "@/components/utils/buttons/OutlinedButton";
import languageData from "@/language/settings.json";
import { WorldIcon, MailIcon } from "@/constants/icons";
import { MdEmail } from "react-icons/md";
import {
  delay,
  opacityAnimation,
  displayAnimation,
} from "@/utils/delayFunction";
import { useStore } from "@/store";
export default function GuestSettings() {
  useEffect(() => {
    document.title = "Settings | SOS Travelers";
  }, []);
  const router = useRouter();
  const store = useStore();
  const [loading, setLoading] = useState(true); //
  const { setLanguage, language, currency, setCurrency } = store;
  const [isOnUbication, setIsOnUbication] = useState(false);
  const [selection, setSelection] = useState({});
  const [selectionCurrency, setSelectionCurrency] = useState({});
  const [selectionTheme, setSelectionTheme] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setSelection({
      value: language,
      label: languageData.language[language][language],
    });
    setSelectionCurrency({
      value: currency,
      label: languageData["currency"][currency][language],
    });
    const theme = Cookies.get("theme");
    if (theme && (theme == "dark" || theme == "light")) {
      setSelectionTheme({
        value: theme,
        label: languageData.theme[theme][language],
      });
    } else {
      setSelectionTheme({
        value: "default",
        label: languageData.theme["default"][language],
      });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    delay(250, () => {
      setLoading(false);
    });
  }, []);

  const onFunction = () => {
    console.log("On");
  };

  const offFunction = () => {
    console.log("Off");
  };

  const setValue = (valor) => {
    setLanguage(valor.value);
    Cookies.set("language", valor.value);
    setSelection({
      value: valor.value,
      label: languageData.language[valor.value][valor.value],
    });
    setSelectionCurrency({
      value: currency,
      label: languageData["currency"][currency][valor.value],
    });
  };
  const setValueCurrency = (valor) => {
    setCurrency(valor.value);
    Cookies.set("currency", valor.value);
    setSelectionCurrency({
      value: valor.value, // ✅ ahora sí el nuevo valor
      label: languageData["currency"][valor.value][language],
    });
  };

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark); // ← esta línea faltaba
  }, []);

  const setValueTheme = (valor) => {
    const root = document.documentElement;
    if (valor.value == "dark") {
      Cookies.set("theme", valor.value);
      root.classList.add("dark");
      setSelectionTheme({
        value: valor.value,
        label: languageData.theme[valor.value][language],
      });
    } else if (valor.value == "light") {
      Cookies.set("theme", valor.value);
      root.classList.remove("dark");
      setSelectionTheme({
        value: valor.value,
        label: languageData.theme[valor.value][language],
      });
    } else {
      if (darkMode) {
        Cookies.set("theme", "dark");
        root.classList.add("dark");
      } else {
        Cookies.set("theme", "light");
        root.classList.remove("dark");
      }
      setSelectionTheme({
        value: "default",
        label: languageData.theme["default"][language],
      });
    }
  };

  const optionsCurency = [
    { value: "usd", label: languageData["currency"]["usd"][language] },
    { value: "eur", label: languageData["currency"]["eur"][language] },
    { value: "brl", label: languageData["currency"]["brl"][language] },
  ];

  const optionsSupport = [
    { value: "en", label: languageData.language[language]["en"] },
    { value: "es", label: languageData.language[language]["es"] },
    { value: "fr", label: languageData.language[language]["fr"] },
    { value: "de", label: languageData.language[language]["de"] },
    { value: "pt", label: languageData.language[language]["pt"] },
  ];
  const optionsTheme = [
    { value: "default", label: languageData.theme.default[language] },
    { value: "dark", label: languageData.theme.dark[language] },
    { value: "light", label: languageData.theme.light[language] },
  ];

  return (
    <div
      className={`min-h-screen bg-backgroundP p-4 flex flex-col 
          transform transition-all duration-800 ease-out
          transition-opacity duration-800 ease-out
         ${loading ? opacityAnimation : displayAnimation}
        `}
    >
      {/* <OptionCard title="Languaje" subtitle="English" icon={WorldIcon} /> */}

      <Link href="support" className="block">
        <OptionCard
          title={languageData.support.title[language]}
          subtitle={languageData.support.body[language]}
          icon={MdEmail}
        ></OptionCard>
      </Link>
      <h1 className={`text-textColor text-sm font-semibold mt-3 mb-2 `}>
        {languageData.titleLanguage[language]}
      </h1>
      <Select
        className="w-full max-w-lg rounded-xl my-1 mb-3"
        options={optionsSupport}
        value={selection}
        // onBlur={() =>
        //   setSelection({
        //     value: "en",
        //     label: "English",
        //   })
        // }
        onChange={(selectedOption) => setValue(selectedOption)}
        isSearchable={false}
        styles={{
          control: (provided) => ({
            ...provided,
            borderColor: "#00A0D5",
            borderRadius: "10px",

            boxShadow: "none",
            "&:hover": {
              borderColor: "#00A0D5",
            },
          }),
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#fff" : "#000",
            backgroundColor: state.isSelected
              ? "#00A0D5" // Fondo sólido más fuerte para la opción seleccionada
              : state.isFocused
              ? "rgba(0, 119, 182, 0.2)" // Fondo más suave para el hover
              : "#fff", // Fondo blanco por defecto
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 119, 182, 0.2)", // Hover igual al enfoque
            },
          }),
        }}
      />

      <h1 className={`text-textColor text-sm font-semibold mt-3 mb-2 `}>
        {languageData.titleCurrency[language]}
      </h1>
      <Select
        className="w-full max-w-lg rounded-xl my-1 mb-3"
        options={optionsCurency}
        value={selectionCurrency}
        // onBlur={() =>
        //   setSelection({
        //     value: "en",
        //     label: "English",
        //   })
        // }
        onChange={(selectedOption) => setValueCurrency(selectedOption)}
        isSearchable={false}
        styles={{
          control: (provided) => ({
            ...provided,
            borderColor: "#00A0D5",
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#00A0D5",
            },
          }),
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#fff" : "#000",
            backgroundColor: state.isSelected
              ? "#00A0D5" // Fondo sólido más fuerte para la opción seleccionada
              : state.isFocused
              ? "rgba(0, 119, 182, 0.2)" // Fondo más suave para el hover
              : "#fff", // Fondo blanco por defecto
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 119, 182, 0.2)", // Hover igual al enfoque
            },
          }),
        }}
      />

      <h1 className={`text-textColor text-sm font-semibold mt-3 mb-2 `}>
        {languageData.titleTheme[language]}
      </h1>

      <Select
        className="w-full max-w-lg rounded-xl my-1 mb-3"
        options={optionsTheme}
        value={selectionTheme}
        // onBlur={() =>
        //   setSelection({
        //     value: "en",
        //     label: "English",
        //   })
        // }
        onChange={(selectedOption) => setValueTheme(selectedOption)}
        isSearchable={false}
        styles={{
          control: (provided) => ({
            ...provided,
            borderColor: "#00A0D5",
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#00A0D5",
            },
          }),
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#fff" : "#000",
            backgroundColor: state.isSelected
              ? "#00A0D5" // Fondo sólido más fuerte para la opción seleccionada
              : state.isFocused
              ? "rgba(0, 119, 182, 0.2)" // Fondo más suave para el hover
              : "#fff", // Fondo blanco por defecto
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 119, 182, 0.2)", // Hover igual al enfoque
            },
          }),
        }}
      />

      {/* <div className="flex flex-col my-4">
        <OptionSwitch
          title="Activate Ubication"
          onFunction={onFunction}
          offFunction={offFunction}
          isOn={isOnUbication}
          setIsOn={setIsOnUbication}
        />
      </div> */}
      <div className="flex items-center justify-center mb-4  max-w-lg">
        <Image
          src="/icons/LogoCompleto.svg"
          width={120}
          height={120}
          alt="SOS Traveler Logo"
        />
      </div>

      <OutlinedButton
        text={languageData.sigUpButton[language]}
        onClick={() => router.push("/register")}
      />
    </div>
  );
}
