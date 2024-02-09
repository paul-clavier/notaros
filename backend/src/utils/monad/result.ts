import { monadLogger as logger } from "../logger";
import { zip } from "../objects";
import { LooseRecord } from "../types";
import { None, Some, type Option } from "./option";

interface IResult<A, E> {
    /**
     * Returns the Result containing the value from the callback
     *
     * (Result\<A, E>, A => B) => Result\<B>
     */
    map<B>(this: Result<A, E>, func: (value: A) => B): Result<B, E>;

    /**
     * Returns the Result containing the error returned from the callback
     *
     * (Result\<A, E>, E => F) => Result\<F>
     */
    mapError<F>(this: Result<A, E>, func: (value: E) => F): Result<A, F>;

    /**
     * Takes a function and try/catch it, wrapping the result or error in a Result
     *
     */
    mapCatchError<B, F extends never>(
        this: Result<A, E>,
        func: (value: A) => B,
    ): Result<B, F | E>;

    /**
     * Returns the Result containing the value from the callback
     *
     * (Result\<A, E>, A => Result\<B, F>) => Result\<B, E | F>
     */
    flatMap<B, F>(
        this: Result<A, E>,
        func: (value: A) => Result<B, F>,
    ): Result<B, F | E>;

    /**
     * Returns the Result containing the value from the callback
     *
     * (Result\<A, E>, E => Result\<A, F>) => Result\<A | B, F>
     */
    flatMapError<B, F>(
        this: Result<A, E>,
        func: (value: E) => Result<B, F>,
    ): Result<A | B, F>;

    /**
     * Return the value if present, and the fallback otherwise
     *
     * (Result\<A, E>, A) => A
     */
    getWithDefault(this: Result<A, E>, defaultValue: A): A;

    /**
     * Explodes the Result given its case
     */
    match<B>(
        this: Result<A, E>,
        config: { Ok: (value: A) => B; Error: (error: E) => B },
    ): B;

    /**
     * Logs the monad content and returns `this`
     */
    log(this: Result<A, E>): Result<A, E>;

    /**
     * Runs the callback and returns `this`
     */
    tap(
        this: Result<A, E>,
        func: (result: Result<A, E>) => unknown,
    ): Result<A, E>;

    /**
     * Runs the callback if ok and returns `this`
     */
    tapOk(this: Result<A, E>, func: (value: A) => unknown): Result<A, E>;

    /**
     * Runs the callback if error and returns `this`
     */
    tapError(this: Result<A, E>, func: (error: E) => unknown): Result<A, E>;

    /**
     * Return an option of the value
     *
     * (Result\<A, E>) => Option\<A>
     */
    toOption(this: Result<A, E>): Option<A>;

    /**
     * Typeguard
     */
    isOk(this: Result<A, E>): this is Ok<A, E>;

    /**
     * Typeguard
     */
    isError(this: Result<A, E>): this is Error<A, E>;
}

type Ok<A, E> = IResult<A, E> & {
    tag: "Ok";
    value: A;

    /**
     * Returns the ok value. Use within `if (result.isOk()) { ... }`
     */
    get(this: Ok<A, E>): A;
};

type Error<A, E> = IResult<A, E> & {
    tag: "Error";
    value: E;

    /**
     * Returns the error value. Use within `if (result.isError()) { ... }`
     */
    getError(this: Error<A, E>): E;
};

export type Result<A, E> = Ok<A, E> | Error<A, E>;

const resultProto = (<A, E>(): IResult<A, E> => ({
    map<B>(this: Result<A, E>, func: (value: A) => B) {
        return this.tag === "Ok"
            ? Ok(func(this.value))
            : (this as unknown as Result<B, E>);
    },

    mapError<F>(this: Result<A, E>, func: (value: E) => F) {
        return this.tag === "Ok"
            ? (this as unknown as Result<A, F>)
            : Error(func(this.value));
    },

    mapCatchError<B, F>(this: Result<A, E>, func: (value: A) => B) {
        if (this.tag === "Ok") {
            try {
                return Ok(func(this.value));
            } catch (error: unknown) {
                return Error(error as F) as Result<B, F | E>;
            }
        }
        return this as unknown as Result<B, F | E>;
    },

    flatMap<B, F>(this: Result<A, E>, func: (value: A) => Result<B, F>) {
        return this.tag === "Ok"
            ? func(this.value)
            : (this as unknown as Result<B, F | E>);
    },

    flatMapError<B, F>(this: Result<A, E>, func: (value: E) => Result<B, F>) {
        return this.tag === "Ok"
            ? (this as unknown as Result<A | B, F>)
            : func(this.value);
    },

    getWithDefault(this: Result<A, E>, defaultValue: A) {
        return this.tag === "Ok" ? this.value : defaultValue;
    },

    match<B>(
        this: Result<A, E>,
        config: { Ok: (value: A) => B; Error: (error: E) => B },
    ) {
        return this.tag === "Ok"
            ? config.Ok(this.value)
            : config.Error(this.value);
    },

    log(this: Result<A, E>) {
        if (this.tag === "Ok") {
            logger.log("Result.Ok", this.value);
        } else {
            logger.error("Result.Error", this.value);
        }
        return this;
    },

    tap(this: Result<A, E>, func: (result: Result<A, E>) => unknown) {
        func(this);
        return this;
    },

    tapOk(this: Result<A, E>, func: (value: A) => unknown) {
        if (this.tag === "Ok") {
            func(this.value);
        }
        return this;
    },

    tapError(this: Result<A, E>, func: (error: E) => unknown) {
        if (this.tag === "Error") {
            func(this.value);
        }
        return this;
    },

    toOption(this: Result<A, E>) {
        return this.tag === "Ok" ? Some(this.value) : None();
    },

    isOk(this: Result<A, E>): boolean {
        return this.tag === "Ok";
    },

    isError(this: Result<A, E>): boolean {
        return this.tag === "Error";
    },
}))();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
resultProto.__monad_type__ = "Result";

const okProto = (<A, E>(): Omit<Ok<A, E>, "tag" | "value"> => ({
    ...(resultProto as IResult<A, E>),

    get() {
        return this.value;
    },
}))();

const errorProto = (<A, E>(): Omit<Error<A, E>, "tag" | "value"> => ({
    ...(resultProto as IResult<A, E>),

    getError() {
        return this.value;
    },
}))();

const Ok = <A = never, E = never>(value: A): Result<A, E> => {
    const result = Object.create(okProto) as Ok<A, E>;
    result.tag = "Ok";
    result.value = value;
    return result;
};

const Error = <A = never, E = never>(value: E): Result<A, E> => {
    const result = Object.create(errorProto) as Error<A, E>;
    result.tag = "Error";
    result.value = value;
    return result;
};

export const Result = {
    /**
     * Create an Result.Ok value
     */
    Ok,

    /**
     * Create an Result.Error value
     */
    Error,

    isResult: (value: unknown): value is Result<unknown, unknown> =>
        value != null &&
        (Object.prototype.isPrototypeOf.call(okProto, value) ||
            Object.prototype.isPrototypeOf.call(errorProto, value)),

    /**
     * Runs the function and resolves a result of its return value, or to an error if thrown
     */
    fromExecution<A, E = unknown>(func: () => A): Result<A, E> {
        try {
            return Result.Ok(func());
        } catch (error) {
            return Result.Error(error) as Result<A, E>;
        }
    },

    /**
     * Takes the promise and resolves a result of its value, or to an error if rejected
     */
    async fromPromise<A, E = unknown>(
        promise: Promise<A>,
    ): Promise<Result<A, E>> {
        try {
            const value = await promise;
            return Result.Ok<A, E>(value);
        } catch (error) {
            return Result.Error<A, E>(error as E);
        }
    },

    /**
     * Takes the option and turns it into Ok(value) is Some, or Error(valueWhenNone)
     */
    fromOption<A, E>(option: Option<A>, valueWhenNone: E): Result<A, E> {
        return option.toResult(valueWhenNone);
    },

    fromBoolean<A, E>(
        value: boolean,
        config: { value: A; error: E },
    ): Result<A, E> {
        if (value) return Result.Ok(config.value);
        return Result.Error(config.error);
    },

    /**
     * Turns an array of results into a result of array
     */
    all<Results extends Result<any, any>[] | []>(results: Results) {
        const length = results.length;
        let acc = Result.Ok<Array<unknown>, unknown>([]);
        let index = 0;

        while (true) {
            if (index >= length) {
                return acc as Result<
                    {
                        [K in keyof Results]: Results[K] extends Result<
                            infer T,
                            any
                        >
                            ? T
                            : never;
                    },
                    {
                        [K in keyof Results]: Results[K] extends Result<
                            any,
                            infer T
                        >
                            ? T
                            : never;
                    }[number]
                >;
            }

            const item = results[index];

            if (item != null) {
                acc = acc.flatMap((array) => {
                    return item.map((value) => {
                        array.push(value);
                        return array;
                    });
                });
            }

            index++;
        }
    },

    /**
     * Turns an dict of results into a results of dict
     */
    allFromDict<Dict extends LooseRecord<Result<any, any>>>(
        dict: Dict,
    ): Result<
        {
            [K in keyof Dict]: Dict[K] extends Result<infer T, any> ? T : never;
        },
        {
            [K in keyof Dict]: Dict[K] extends Result<any, infer T> ? T : never;
        }[keyof Dict]
    > {
        const dictKeys = Object.keys(dict) as (keyof Dict)[];

        return Result.all(Object.values(dict)).map((values) =>
            Object.fromEntries(zip(dictKeys, values)),
        );
    },

    equals<A, E>(
        a: Result<A, E>,
        b: Result<A, E>,
        equals: (a: A, b: A) => boolean,
    ) {
        if (a.tag !== b.tag) {
            return false;
        }
        if (a.tag === "Error" && b.tag === "Error") {
            return true;
        }
        return equals(a.value as unknown as A, b.value as unknown as A);
    },
};
