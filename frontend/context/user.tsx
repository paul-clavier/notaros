import { User } from "@/api/user";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const UserContext = createContext<User | null>(null);
const SetUserContext = createContext<(user: User | null) => void>(() => {
    /*no-op*/
});

UserContext.displayName = "UserContext";
SetUserContext.displayName = "SetUserContext";

const LOCALSTORAGE_USER_KEY = "user";

const getUserFromLocalStorage = (): User | null => {
    try {
        const rawUser = localStorage.getItem(LOCALSTORAGE_USER_KEY);
        return JSON.parse(rawUser || "");
    } catch {
        return null;
    }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(getUserFromLocalStorage());

    useEffect(() => {
        localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
    }, [user]);

    /**
     * When another window, updates the
     * user, then get the user from the local storage to update the state
     * accordingly.
     */
    const updateUser = useCallback(() => {
        const localStorageUser = localStorage.getItem(LOCALSTORAGE_USER_KEY);
        const serialisedUser = JSON.stringify(user);
        if (serialisedUser !== localStorageUser)
            setUser(getUserFromLocalStorage());
    }, [user]);

    useEffect(() => {
        window.addEventListener("storage", updateUser);
        return () => window.removeEventListener("storage", updateUser);
    }, [updateUser]);

    return (
        <SetUserContext.Provider value={setUser}>
            <UserContext.Provider value={user}>{children}</UserContext.Provider>
        </SetUserContext.Provider>
    );
};

export const useOptionalUser = () => useContext(UserContext);
export const useUser = () => {
    const user = useContext(UserContext);
    if (user === null)
        throw Error(
            `${useUser.name} should only be called when a user is available.`,
        );
    return user;
};
export const useSetUser = () => useContext(SetUserContext);
