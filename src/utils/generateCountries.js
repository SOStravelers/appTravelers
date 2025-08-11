// src/utils/generateCountries.js
import countriesLib from "i18n-iso-countries";
import { countries as countriesList } from "countries-list";
import fs from "fs";

// Cargar idiomas correctamente (accediendo a .default)
const en = (
  await import("i18n-iso-countries/langs/en.json", { assert: { type: "json" } })
).default;
const es = (
  await import("i18n-iso-countries/langs/es.json", { assert: { type: "json" } })
).default;
const pt = (
  await import("i18n-iso-countries/langs/pt.json", { assert: { type: "json" } })
).default;
const fr = (
  await import("i18n-iso-countries/langs/fr.json", { assert: { type: "json" } })
).default;
const de = (
  await import("i18n-iso-countries/langs/de.json", { assert: { type: "json" } })
).default;

// Registrar idiomas
countriesLib.registerLocale(en);
countriesLib.registerLocale(es);
countriesLib.registerLocale(pt);
countriesLib.registerLocale(fr);
countriesLib.registerLocale(de);

// Generar lista de países
const full = Object.entries(countriesList).map(([code, data]) => ({
  code,
  dial_code: data.phone ? `+${data.phone}` : "",
  name: {
    en: countriesLib.getName(code, "en") || code,
    es: countriesLib.getName(code, "es") || code,
    pt: countriesLib.getName(code, "pt") || code,
    fr: countriesLib.getName(code, "fr") || code,
    de: countriesLib.getName(code, "de") || code,
  },
}));

// Guardar archivo JSON
fs.writeFileSync(
  "./src/utils/countriesFull.json",
  JSON.stringify(full, null, 2),
  "utf-8"
);

console.log("✅ Archivo countriesFull.json generado correctamente");
