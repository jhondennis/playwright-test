import { Locale } from "../i18n-config";

const dictionaries = {
  en: () => import("./en").then((module) => module.en),
  es: () => import("./es").then((module) => module.es),
};

export const getDictionaryHome = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.es();
