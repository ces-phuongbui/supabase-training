import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import vi from "./locales/vi";

const resources = {
  en,
  vi,
};

i18n.use(initReactI18next).init({
  lng: "en",
  resources,
  supportedLngs: ["en", "vi"],
  fallbackLng: ["en", "vi"],
});

export default i18n;
