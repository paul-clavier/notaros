/**
 * Validates that the given url is a relative path and not an external
 * website. This prevents open redirect attacks.
 */
export const getLocalUrl = (url: string): string => {
    const currentHost = window.location.host;
    const newHost = new URL(url, window.location.href).host;
    if (currentHost !== newHost) {
        return "";
    }
    return url;
};
