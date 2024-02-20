// This method is really generic and can be called from anywhere
// eslint-disable-next-line no-restricted-imports
import { t } from "i18next";

type Errors = string | Errors[] | { [key: string]: Errors };

const flattenErrors = (errors: Errors): string[] => {
    if (typeof errors === "string") return [errors];
    if (Array.isArray(errors)) return errors.map(flattenErrors).flat();
    return Object.values(errors).map(flattenErrors).flat();
};

/**
 * Build an error message from an errored response
 */
export const buildError = async (
    response: Response,
    defaultError = t("generic.unknownError"),
): Promise<string> => {
    try {
        const errorsArray = flattenErrors(await response.json());
        return errorsArray.join(" ");
    } catch (e) {
        return defaultError;
    }
};
