import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";
import CustomSelector from "@/components/utils/selector/CustomSelector";
import languageData from "@/language/settings.json";
import { useStore } from "@/store";

/* ──────────────────────────────────────────────
   Reutilizable para renderizar selectores
─────────────────────────────────────────────── */
function SettingsSelector({ title, options, value, onChange }) {
  return (
    <>
      <h1 className="text-textColor text-sm font-semibold mt-3 mb-2 self-start">
        {title}
      </h1>
      <CustomSelector options={options} value={value} onChange={onChange} />
    </>
  );
}

export default function SettingsComponent() {
  const store = useStore();
  const {
    setLanguage,
    language,
    currency,
    setCurrency,
    changeTheme,
    setChangeTheme,
  } = store;

  const [darkMode, setDarkMode] = useState(false);
  const [selections, setSelections] = useState({
    language: null,
    currency: null,
    theme: null,
  });

  useEffect(() => {
    document.title = "Settings | SOS Travelers";

    // Set default values
    const theme = Cookies.get("theme");
    const actualTheme =
      theme === "dark" || theme === "light" ? theme : "default";

    setSelections({
      language: {
        value: language,
        label: languageData.language[language][language],
      },
      currency: {
        value: currency,
        label: languageData.currency[currency][language],
      },
      theme: {
        value: actualTheme,
        label: languageData.theme[actualTheme][language],
      },
    });
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, [selections.theme]);

  const handleChange = (key, val) => {
    const newSelections = { ...selections, [key]: val };
    setSelections(newSelections);

    if (key === "language") {
      setLanguage(val.value);
      Cookies.set("language", val.value);

      // Update all labels with new language
      setSelections({
        language: {
          value: val.value,
          label: languageData.language[val.value][val.value],
        },
        currency: {
          value: selections.currency?.value,
          label: languageData.currency[selections.currency?.value][val.value],
        },
        theme: {
          value: selections.theme?.value,
          label: languageData.theme[selections.theme?.value][val.value],
        },
      });
    }

    if (key === "currency") {
      setCurrency(val.value);
      Cookies.set("currency", val.value);
    }

    if (key === "theme") {
      const root = document.documentElement;

      if (val.value === "dark") {
        Cookies.set("theme", "dark");
        root.classList.add("dark");
      } else if (val.value === "light") {
        Cookies.set("theme", "light");
        root.classList.remove("dark");
      } else {
        // default
        if (darkMode) {
          Cookies.set("theme", "dark");
          root.classList.add("dark");
        } else {
          Cookies.set("theme", "light");
          root.classList.remove("dark");
        }
      }

      setChangeTheme(!changeTheme);
    }
  };

  const config = [
    {
      key: "language",
      title: languageData.titleLanguage[language],
      options: ["en", "es", "fr", "de", "pt"].map((code) => ({
        value: code,
        label: languageData.language[language][code],
      })),
    },
    {
      key: "currency",
      title: languageData.titleCurrency[language],
      options: ["usd", "eur", "brl"].map((code) => ({
        value: code,
        label: languageData.currency[code][language],
      })),
    },
    {
      key: "theme",
      title: languageData.titleTheme[language],
      options: ["default", "dark", "light"].map((code) => ({
        value: code,
        label: languageData.theme[code][language],
      })),
    },
  ];

  return (
    <div className="w-full max-w-md flex flex-col self-center">
      {/* Render all selectors dinamically */}
      {config.map(({ key, title, options }) => (
        <SettingsSelector
          key={key}
          title={title}
          options={options}
          value={selections[key]}
          onChange={(val) => handleChange(key, val)}
        />
      ))}

      <div className="flex items-center justify-center mb-5 mt-3">
        {selections.theme?.value === "dark" ||
        (selections.theme?.value === "default" && darkMode) ? (
          <Image
            src="/icons/LogoCompletoBlanco.svg"
            width={120}
            height={120}
            alt="SOS Traveler Logo"
          />
        ) : (
          <Image
            src="/icons/LogoCompleto.svg"
            width={120}
            height={120}
            alt="SOS Traveler Logo"
          />
        )}
      </div>
    </div>
  );
}
