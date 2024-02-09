import { AsArray } from "../types";

const isPromise = <T>(object: T | Promise<T>): object is Promise<T> =>
    object instanceof Promise;

class Pipe<T> {
    currentValue: T;

    constructor(initialValue: T) {
        this.currentValue = initialValue;
    }

    map = <MT>(mappingFunction: (...args: AsArray<T>) => MT): Pipe<MT> => {
        const currentValueAsArray = Array.isArray(this.currentValue)
            ? this.currentValue
            : [this.currentValue];
        const newValue = mappingFunction(...currentValueAsArray);
        return pipe(newValue);
    };

    log = () => {
        console.log({ value: this.currentValue });
        return this;
    };

    get = () => this.currentValue;
}

class PromisePipe<T> {
    currentValue: Promise<T | undefined>;

    constructor(initialValue?: T | Promise<T>) {
        if (initialValue === undefined)
            this.currentValue = new Promise((resolve) => resolve(undefined));
        this.currentValue = isPromise(initialValue)
            ? initialValue
            : new Promise((resolve) => resolve(initialValue));
    }

    private getCurrentValueAsArray = (): Promise<AsArray<T>> => {
        return this.currentValue.then((currentValue) =>
            Array.isArray(currentValue)
                ? currentValue
                : currentValue
                ? [currentValue]
                : [],
        );
    };

    map = <MT>(
        mappingFunction: (...args: AsArray<T>) => MT,
    ): PromisePipe<MT> => {
        const newValue: Promise<MT> = this.getCurrentValueAsArray().then(
            (value) => mappingFunction(...value),
        );
        return promisePipe(newValue);
    };

    tap = (tappingFunction: (...args: AsArray<T>) => any) => {
        this.getCurrentValueAsArray().then((value) => {
            tappingFunction(...value);
        });
        return this;
    };

    catchError = <CT>(
        catchingFunction: (...args: AsArray<T>) => CT,
    ): PromisePipe<CT | T> => {
        const newValue = this.currentValue.catch(catchingFunction);
        return promisePipe(newValue);
    };

    log = () => {
        this.currentValue = this.currentValue.then((value) => {
            console.log({ value });
            return value;
        });
        return this;
    };

    logError = () => {
        this.currentValue.catch((error) => {
            console.error({ error });
        });
        return this;
    };

    get = async () => await this.currentValue;
}

export const pipe = <T>(initialValue: T): Pipe<T> => {
    return new Pipe(initialValue);
};

/**
 *
 * @param initialValue optional parameter to initialize the pipeline
 * @returns a pipeline of promises
 *
 * @example // Basic example of number multiplication
 * const square = (n: number) => n * n;
 * const multiply = (x: number, y: number) => x * y;
 *
 * const twelve = pipe(2)
 *      .map(square)
 *      .map((value: number) => [3, value])
 *      .map(multiply)
 *      .get();
 *
 * @example // Throwing and catching error
 * const errorThrower = () => {
 *   throw "toto";
 * };
 *
 * const five = promisePipe(2)
 *      .log() // also logs 2
 *      .logError() // nothing logs
 *      .map(errorThrower)
 *      .log() // nothing logs
 *      .logError() // logs "toto"
 *      .catchError(() => 5)
 *      .get()
 */
export const promisePipe = <T>(initialValue?): PromisePipe<T> => {
    return new PromisePipe(initialValue);
};
