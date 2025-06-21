import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import frCommon from "@/locales/fr/common.json";
import enCommon from "@/locales/en/common.json";

i18next.use(initReactI18next).init({
  lng: "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    fr: {
      common: frCommon,
    },
    en: {
      common: enCommon,
    },
  },
});

export default i18next;
