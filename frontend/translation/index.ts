import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import englishTranslation from "./en.json";
import frenchTranslation from "./fr.json";
import {
    DEFAULT_USER_OPTIONS,
    getUserOptionsFromLocalStorage,
} from "@/context/user-options";

export const LANGUAGES = ["en-GB", "fr"] as const;
export type Language = (typeof LANGUAGES)[number];

// This intermediary method is especially used to validate the messages type.
const loadResources = <T>(
    englishMessages: T,
    frenchTranslation: T,
): Record<Language, { translation: T }> => ({
    "en-GB": {
        translation: englishMessages,
    },
    fr: {
        translation: frenchTranslation,
    },
});

i18n.use(initReactI18next).init({
    resources: loadResources(englishTranslation, frenchTranslation),
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

export { i18n };
