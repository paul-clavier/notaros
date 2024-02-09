import { zip } from "../objects";
import { LooseRecord } from "../types";
import { Result } from "./result";

interface IOption<A> {
    /**
     * Returns the Option containing the value from the callback
     *
     * (Option\<A>, A => B) => Option\<B>
     */
    map<B>(this: Option<A>, func: (value: A) => B): Option<B>;

    /**
     * Returns the Option containing the value from the callback
     *
     * (Option\<A>, A => Option\<B>) => Option\<B>
     */
    flatMap<B>(this: Option<A>, func: (value: A) => Option<B>): Option<B>;

    /**
     * Return the value if present, and the fallback otherwise
     *
     * (Option\<A>, A) => A
     */
    getWithDefault(this: Option<A>, defaultValue: A): A;

    /**
     * Explodes the Option given its case
     */
    match<B>(
        this: Option<A>,
        config: { Some: (value: A) => B; None: () => B },
    ): B;

    /**
     * Converts the Option\<A> to a `A | undefined`
     */
    toUndefined(this: Option<A>): A | undefined;

    /**
     * Converts the Option\<A> to a `A | null`
     */
    toNull(this: Option<A>): A | null;

    /**
     * Takes the option and turns it into Ok(value) is Some, or Error(valueWhenNone)
     */
    toResult<E>(this: Option<A>, valueWhenNone: E): Result<A, E>;

    /**
     * Typeguard
     */
    isSome(this: Option<A>): this is Some<A>;

    /**
     * Typeguard
     */
    isNone(this: Option<A>): this is None<A>;
}

type Some<A> = IOption<A> & {
    tag: "Some";
    value: A;

    /**
     * Returns the value. Use within `if (option.isSome()) { ... }`
     */
    get(this: Some<A>): A;
};

type None<A> = IOption<A> & {
    tag: "None";
};

export type Option<A> = Some<A> | None<A>;

const optionProto = (<A>(): IOption<A> => ({
    map<B>(this: Option<A>, func: (value: A) => B) {
        return this.tag === "Some"
            ? Some(func(this.value))
            : (this as unknown as Option<B>);
    },

    flatMap<B>(this: Option<A>, func: (value: A) => Option<B>) {
        return this.tag === "Some"
            ? func(this.value)
            : (this as unknown as Option<B>);
    },

    getWithDefault(this: Option<A>, defaultValue: A) {
        return this.tag === "Some" ? this.value : defaultValue;
    },

    match<B>(
        this: Option<A>,
        config: { Some: (value: A) => B; None: () => B },
    ) {
        return this.tag === "Some" ? config.Some(this.value) : config.None();
    },

    toUndefined(this: Option<A>) {
        return this.tag === "Some" ? this.value : undefined;
    },

    toNull(this: Option<A>) {
        return this.tag === "Some" ? this.value : null;
    },

    toResult<E>(this: Option<A>, valueWhenNone: E): Result<A, E> {
        return this.match({
            Some: (ok) => Result.Ok(ok),
            None: () => Result.Error(valueWhenNone),
        });
    },

    isSome(this: Option<A>): boolean {
        return this.tag === "Some";
    },

    isNone(this: Option<A>): boolean {
        return this.tag === "None";
    },
}))();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
optionProto.__monad_type__ = "Option";

const someProto = (<A>(): Omit<Some<A>, "tag" | "value"> => ({
    ...(optionProto as IOption<A>),

    get() {
        return this.value;
    },
}))();

/**
 * Static methods to create and manipulate Options from standard values
 */
export const Some = <A = never>(value: A): Option<A> => {
    const option = Object.create(someProto) as Some<A>;
    option.tag = "Some";
    option.value = value;
    return option;
};

const NONE = (() => {
    const option = Object.create(optionProto) as None<unknown>;
    option.tag = "None";
    return option;
})();

export const None = <A = never>(): Option<A> => NONE as None<A>;

export const Option = {
    /**
     * Create an Option.Some value
     */
    Some,

    /**
     * Create an Option.None value
     */
    None,

    isOption: (value: unknown): value is Option<unknown> =>
        value != null &&
        (Object.prototype.isPrototypeOf.call(optionProto, value) ||
            Object.prototype.isPrototypeOf.call(someProto, value)),

    /**
     * Create an Option from a nullable value
     */
    fromNullable<A>(nullable: A | null | undefined): Option<A> {
        return nullable === null || nullable === undefined
            ? None<A>()
            : Some<A>(nullable);
    },

    /**
     * Create an Option from a value | null
     */
    fromNull<A>(nullable: A | null): Option<A> {
        return nullable === null ? None<A>() : Some<A>(nullable);
    },

    /**
     * Create an Option from a undefined | value
     */
    fromUndefined<A>(nullable: A | undefined): Option<A> {
        return nullable === undefined ? None<A>() : Some<A>(nullable);
    },

    /**
     * Turns an array of options into an option of array
     */
    all<Options extends Option<any>[] | []>(options: Options) {
        const length = options.length;
        let acc = Option.Some<Array<unknown>>([]);
        let index = 0;

        while (true) {
            if (index >= length) {
                return acc as Option<{
                    [K in keyof Options]: Options[K] extends Option<infer T>
                        ? T
                        : never;
                }>;
            }

            const item = options[index];

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
     * Turns an dict of options into a options of dict
     */
    allFromDict<Dict extends LooseRecord<Option<any>>>(
        dict: Dict,
    ): Option<{
        [K in keyof Dict]: Dict[K] extends Option<infer T> ? T : never;
    }> {
        const dictKeys = Object.keys(dict);

        return this.all(Object.values(dict)).map((values) =>
            Object.fromEntries(zip(dictKeys, values)),
        );
    },

    equals<A>(
        a: Option<A>,
        b: Option<A>,
        equals: (a: A, b: A) => boolean,
    ): boolean {
        return a.tag === "Some" && b.tag === "Some"
            ? equals(a.value, b.value)
            : a.tag === b.tag;
    },
};
