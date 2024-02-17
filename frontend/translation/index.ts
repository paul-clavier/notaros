import {
    DEFAULT_USER_OPTIONS,
    getUserOptionsFromLocalStorage,
} from "@/context/user-options";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import zodEnglishTranslation from "zod-i18n-map/locales/en/zod.json";
import zodFrenchTranslation from "zod-i18n-map/locales/fr/zod.json";
import englishTranslation from "./en.json";
import frenchTranslation from "./fr.json";

export const LANGUAGES = ["en-GB", "fr"] as const;
export type Language = (typeof LANGUAGES)[number];

i18n.use(initReactI18next).init({
    resources: {
        "en-GB": {
            translation: englishTranslation,
            zod: zodEnglishTranslation,
        },
        fr: {
            translation: frenchTranslation,
            zod: zodFrenchTranslation,
        },
    },
    lng:
        getUserOptionsFromLocalStorage().language ??
        DEFAULT_USER_OPTIONS.language,
    detection: {},
});

i18n.services.formatter?.add("default", (value, lng, options) => {
    if (value) return value;
    return options.value ? options.value : "";
});

i18n.services.formatter?.add("plural", (value) => {
    if (value[value.length - 1] === "s") return value;
    if (value[value.length - 1] === "y") return value.slice(0, -1) + "ies";
    return value + "s";
});

i18n.services.formatter?.add("capitalise", (value) => {
    if (!value) return value;
    return value[0].toLocaleUpperCase() + value.substring(1);
});

z.setErrorMap(zodI18nMap);

export { i18n };
