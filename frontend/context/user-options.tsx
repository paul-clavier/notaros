import { Language } from "@/translation";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useOptionalUser } from "./user";

// TODO Add a usePreferences hook so a user can change preferences

export interface UserOptions {
    language: Language;
    default: boolean;
}

export const DEFAULT_USER_OPTIONS: UserOptions = {
    language: "en-GB",
    default: true,
};

const UserOptionsContext = createContext<UserOptions>(DEFAULT_USER_OPTIONS);
const SetUserOptionsContext = createContext<(user: UserOptions) => void>(() => {
    /* no-op */
});

UserOptionsContext.displayName = "UserOptionsContext";
SetUserOptionsContext.displayName = "SetUserOptionsContext";

const LOCALSTORAGE_USER_OPTIONS_KEY = "user-options";

export const getUserOptionsFromLocalStorage = (): UserOptions => {
    try {
        const rawUserOptions = localStorage.getItem(
            LOCALSTORAGE_USER_OPTIONS_KEY,
        );
        return { ...DEFAULT_USER_OPTIONS, ...JSON.parse(rawUserOptions || "") };
    } catch {
        return DEFAULT_USER_OPTIONS;
    }
};

export const UserOptionsProvider = ({ children }: { children: ReactNode }) => {
    const user = useOptionalUser();
    const [userOptions, setUserOptions] = useState<UserOptions>(
        getUserOptionsFromLocalStorage(),
    );

    useEffect(() => {
        localStorage.setItem(
            LOCALSTORAGE_USER_OPTIONS_KEY,
            JSON.stringify(userOptions),
        );
    }, [userOptions]);

    useEffect(() => {
        if (user === null) {
            setUserOptions(DEFAULT_USER_OPTIONS);
            return;
        }
        if (!userOptions.default) return;
        setUserOptions({
            ...userOptions,
            default: false,
        });
    }, [user, userOptions]);

    return (
        <SetUserOptionsContext.Provider value={setUserOptions}>
            <UserOptionsContext.Provider value={userOptions}>
                {children}
            </UserOptionsContext.Provider>
        </SetUserOptionsContext.Provider>
    );
};

export const useUserOptions = () => useContext(UserOptionsContext);
export const useSetUserOptions = () => useContext(SetUserOptionsContext);
