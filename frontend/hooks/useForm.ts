import { deepEqual } from "@/utils/deepEquals";
import {
    Dispatch,
    SyntheticEvent,
    useCallback,
    useReducer,
    useState,
} from "react";

const GENERAL_FIELD = "non_field_errors" as const;

/* State */

interface ChangeActionPayload<
    T extends Record<keyof T, any>,
    K extends keyof T,
> {
    name: K;
    value: T[K] | null;
}

interface ChangeAction<T extends Record<keyof T, any>> {
    type: "CHANGE";
    payload: ChangeActionPayload<T, keyof T>;
}

type ErrorActionPayload<T> = Partial<Record<keyof T, string[]>>;

interface ErrorAction<T extends Record<string, any>> {
    type: "ERROR";
    payload: ErrorActionPayload<T>;
}

interface UpdateAction<T extends Record<string, any>> {
    type: "UPDATE";
    payload: Partial<T>;
}

type Action<T extends Record<string, any>> =
    | ChangeAction<T>
    | ErrorAction<T>
    | UpdateAction<T>;

/* Form */

interface Options<T> {
    validate?: (form: T) => Partial<Record<keyof T, string[]>>;
    onSuccess?: (json?: any) => void;
    onError?: (
        status: number,
    ) => Partial<Record<keyof T | typeof GENERAL_FIELD, string[]>>;
    resetFormOnSuccess?: boolean;
}

export type Fields<T extends Record<string, any>> = {
    [K in keyof T]: {
        value: T[K];
        onChange: (value: T[K] | null) => void;
        error: string | null;
    };
};

type State<T extends Record<string, any>> = {
    [K in keyof T]: {
        value: T[K];
        error: string | null;
    };
};

/**
 *
 * @param state Current state of the form
 * @param action Can be of 3 types:
 * - Errors will update errors of the form.
 * - Update will update the form when calling updateForm and reset the form with values coming from API.
 * - Change will update one field when user chanegs it from the UI
 * @returns The updated state after the action has been performed
 */
const reducer = <T extends Record<string, any>>(
    state: State<T>,
    action: Action<T>,
): State<T> => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                [action.payload.name]: {
                    value: action.payload.value,
                    error: null,
                },
            };
        case "ERROR": {
            const newState = {} as State<T>;

            for (const key in state) {
                const errors = action.payload[key];
                const error = Array.isArray(errors)
                    ? errors.join(" ")
                    : errors ?? null;
                newState[key] = { ...state[key], error };
            }

            return newState;
        }
        case "UPDATE":
            return { ...state, ...getInitialStateFromData(action.payload) };
    }
};

/**
 * Default state of a form (independant from API. For this, please use updateForm).
 * This comes in handy to defines Select default Values for instance
 *
 * @param initialData The default values of the form. These do not take into account hydration with values coming from API
 * @returns the initial state of the form
 */
const getInitialStateFromData = <T extends Record<string, any>>(
    initialData: T,
): State<T> => {
    const state = {} as State<T>;
    for (const key in initialData) {
        state[key] = {
            value: initialData[key],
            error: null,
        };
    }
    // @ts-expect-error GENERAL_FIELD is not typed in the state,
    // and I cannot make it work
    state[GENERAL_FIELD] = { error: null };
    return state;
};

/**
 * Links Input (i.e UI) and Form state
 *
 * @param state the state form
 * @param dispatch how to update the state from an input change (updates formState when user changes input)
 * @returns The Field props to pass to fields of the form (i.e HTML)
 */
const getFieldsFromState = <T extends Record<string, any>>(
    state: State<T>,
    dispatch: Dispatch<Action<T>>,
): Fields<T> => {
    const fields = {} as Fields<T>;
    for (const key in state) {
        if (key === GENERAL_FIELD) continue;
        fields[key] = {
            ...state[key],
            onChange: (value) =>
                dispatch({
                    type: "CHANGE",
                    payload: { name: key, value },
                }),
        };
    }
    return fields;
};

/**
 *
 * @param state The state of the form
 * @returns The body to send to send to API. It basically is the state without the GENERAL_FIELD (which is reserved for errors)
 */
const getBodyFromState = <T extends Record<string, any>>(
    state: State<T>,
): T => {
    const body = {} as T;
    for (const key in state) {
        if (key === GENERAL_FIELD) continue;
        body[key] = state[key].value;
    }
    return body;
};

export interface UseForm<T extends Record<string, any>> {
    fields: Fields<T>;
    body: T;
    onSubmit: (event: SyntheticEvent<HTMLElement>) => Promise<void>;
    dismissSuccess: () => void;
    dismissUnknownError: () => void;
    updateForm: (data: Partial<T>) => void;
    loading: boolean;
    unknownError: boolean;
    success: boolean;
    generalError: string | null;
    isDirty: boolean;
}

export const useForm = <T extends Record<string, any>>(
    initialData: T,
    makeRequest: (body: T) => Promise<Response>,
    options: Options<T> = {},
): UseForm<T> => {
    const [state, dispatch] = useReducer<
        (prevState: State<T>, action: Action<T>) => State<T>
    >(reducer, getInitialStateFromData(initialData));
    const [loading, setLoading] = useState<boolean>(false);
    const [unknownError, setUnknownError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    if (GENERAL_FIELD in Object.keys(initialData)) {
        throw "The field name 'general' is reserved for setting general errors";
    }

    const fields = getFieldsFromState<T>(state, dispatch);
    const body = getBodyFromState<T>(state);

    const onSubmit = async (event: SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        try {
            /* Reinitialize form state */
            setSuccess(false);
            setUnknownError(false);
            dispatch({ type: "ERROR", payload: {} });

            if (options.validate) {
                const errors = options.validate(body);
                if (Object.keys(errors).length > 0) {
                    dispatch({ type: "ERROR", payload: errors });
                    return;
                }
            }
            setLoading(true);
            const response = await makeRequest(body);
            if (response.ok) {
                setSuccess(true);
                if (options.resetFormOnSuccess) {
                    updateForm(initialData);
                }
                if (options.onSuccess) {
                    options.onSuccess(await response.json());
                }
            } else if (response.status === 400) {
                const json = await response.json();
                dispatch({ type: "ERROR", payload: json });
            } else if (
                options.onError &&
                Object.keys(options.onError(response.status)).length > 0
            ) {
                dispatch({
                    type: "ERROR",
                    payload: options.onError(response.status),
                });
            } else {
                setUnknownError(true);
            }
        } catch {
            setUnknownError(true);
        } finally {
            setLoading(false);
        }
    };

    const dismissSuccess = () => setSuccess(false);
    const dismissUnknownError = () => setUnknownError(false);

    const updateForm = useCallback(
        (data: Partial<T>) =>
            dispatch({
                type: "UPDATE",
                payload: data,
            }),
        [],
    );

    const generalError = state[GENERAL_FIELD].error;

    const isDirty = !deepEqual(body, initialData);

    return {
        fields,
        body,
        onSubmit,
        loading,
        unknownError,
        generalError,
        success,
        dismissSuccess,
        dismissUnknownError,
        updateForm,
        isDirty,
    };
};
