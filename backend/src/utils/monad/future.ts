import { zip } from "../objects";
import { LooseRecord } from "../types";
import { Result } from "./result";

/**
 * @example // Future from a value
 * const futureZero = Future.value(0)
 * @example // Future from a resolver
 * const futureZero = Future.make(resolve => resolve(0))
 * @example // Future from a Result
 * const futureZero = Future.value(Result.Ok(0))
 * const one = await future.mapOk(value => value + 1).resultToPromise()
 */
export class Future<A> {
    /**
     * Creates a new future from its initializer function (like `new Promise(...)`)
     */
    static make = <A>(
        init: (resolver: (value: A) => void) => (() => void) | void,
    ): Future<A> => {
        return new Future(init);
    };

    static isFuture = (value: unknown): value is Future<unknown> =>
        value != null &&
        Object.prototype.isPrototypeOf.call(futureProto, value);

    /**
     * Creates a future resolved to the passed value
     */
    static value = <A>(value: A): Future<A> => {
        const future = Object.create(futureProto);
        future._state = { tag: "Resolved", value };
        return future as Future<A>;
    };

    static Result = <A, E = never>(value: A): Future<Result<A, E>> => {
        const future = Object.create(futureProto);
        const valueAsResult = Result.Ok<A, E>(value);
        future._state = { tag: "Resolved", value: valueAsResult };
        return future as Future<Result<A, E>>;
    };

    /**
     * Converts a Promise to a Future\<Result\<Value, unknown>>
     */
    static fromPromise<A, E extends Error>(
        promise: Promise<A>,
    ): Future<Result<A, E>> {
        return Future.make((resolver) => {
            promise.then(
                (ok) => resolver(Result.Ok(ok)),
                (error: E) => resolver(Result.Error(error)),
            );
        });
    }

    /**
     * Turns an array of futures into a future of array
     */
    static all = <Futures extends readonly Future<any>[] | []>(
        futures: Futures,
        propagateCancel = false,
    ) => {
        const length = futures.length;
        let acc = Future.value<Array<unknown>>([]);
        let index = 0;

        while (true) {
            if (index >= length) {
                return acc as unknown as Future<{
                    [K in keyof Futures]: Futures[K] extends Future<infer T>
                        ? T
                        : never;
                }>;
            }

            const item = futures[index];

            if (item != null) {
                acc = acc.flatMap((array) => {
                    return item.map((value) => {
                        array.push(value);
                        return array;
                    }, propagateCancel);
                }, propagateCancel);
            }

            index++;
        }
    };

    /**
     * Turns an dict of futures into a future of dict
     */
    static allFromDict = <Dict extends LooseRecord<Future<any>>>(
        dict: Dict,
    ): Future<{
        [K in keyof Dict]: Dict[K] extends Future<infer T> ? T : never;
    }> => {
        const dictKeys = Object.keys(dict) as (keyof Dict)[];

        return Future.all(Object.values(dict)).map((values) =>
            Object.fromEntries(zip(dictKeys, values)),
        );
    };

    // Not accessible from the outside
    private _state:
        | {
              tag: "Pending";
              resolveCallbacks?: Array<(value: A) => void>;
              cancel?: void | (() => void);
              cancelCallbacks?: Array<() => void>;
          }
        | { tag: "Cancelled" }
        | { tag: "Resolved"; value: A };

    protected constructor(
        init: (resolver: (value: A) => void) => (() => void) | void,
    ) {
        const resolver = (value: A) => {
            if (this._state.tag === "Pending") {
                this._state.resolveCallbacks?.forEach((func) => func(value));
                this._state = { tag: "Resolved", value };
            }
        };

        this._state = { tag: "Pending" };

        // The following line actually calls the resolver with the value (from init)
        // [Sync] For Futures initialized from a synchronous process, this step will set the state as Resolved with the value
        // [Async] When the init method involves Promises, this step won't do anything as the Promise will not yet have completed, hence not yet calling the resolver
        // [(Sync + Async)Value] Actually this cancel value is what is returned by the init method. It should be used like useEffect return value
        this._state.cancel = init(resolver);
    }

    /**
     * Runs the callback with the future value when resolved
     */
    onResolve(func: (value: A) => void) {
        if (this._state.tag === "Pending") {
            this._state.resolveCallbacks = this._state.resolveCallbacks ?? [];
            this._state.resolveCallbacks.push(func);
        } else if (this._state.tag === "Resolved") {
            func(this._state.value);
        }
    }

    /**
     * Runs the callback if and when the future is cancelled
     */
    onCancel(func: () => void) {
        if (this._state.tag === "Pending") {
            this._state.cancelCallbacks = this._state.cancelCallbacks ?? [];
            this._state.cancelCallbacks.push(func);
        } else if (this._state.tag === "Cancelled") {
            func();
        }
    }

    /**
     * Cancels the future
     */
    cancel() {
        if (this._state.tag === "Pending") {
            const { cancel, cancelCallbacks } = this._state;
            // We have to set the future as cancelled first to avoid an infinite loop
            this._state = { tag: "Cancelled" };
            cancel?.();
            cancelCallbacks?.forEach((func) => func());
        }
    }

    /**
     * Returns the Future containing the value from the callback
     *
     * (Future\<A>, A => B) => Future\<B>
     */
    map<B>(func: (value: A) => B, propagateCancel = false): Future<B> {
        const future = Future.make<B>((resolve) => {
            this.onResolve((value) => {
                resolve(func(value));
            });

            if (propagateCancel) {
                return () => {
                    this.cancel();
                };
            }
        });

        this.onCancel(() => {
            future.cancel();
        });

        return future;
    }

    then(func: (value: A) => void) {
        this.onResolve(func);
        return this;
    }

    /**
     * Returns the Future containing the value from the callback
     *
     * (Future\<A>, A => Future\<B>) => Future\<B>
     */
    flatMap<B>(
        func: (value: A) => Future<B>,
        propagateCancel = false,
    ): Future<B> {
        const future = Future.make<B>((resolve) => {
            this.onResolve((value) => {
                const returnedFuture = func(value);
                returnedFuture.onResolve(resolve);
                returnedFuture.onCancel(() => future.cancel());
            });

            if (propagateCancel) {
                return () => {
                    this.cancel();
                };
            }
        });

        this.onCancel(() => {
            future.cancel();
        });

        return future;
    }

    log(this: Future<A>): Future<A> {
        return this.tap((value) => {
            console.log(this._state.tag, value);
        });
    }

    /**
     * Runs the callback and returns `this`
     */
    tap(this: Future<A>, func: (value: A) => unknown): Future<A> {
        this.onResolve(func);
        return this;
    }

    pipeAsync<A, E, B, F = never>(
        this: Future<Result<A, E>>,
        func: (value: A) => Promise<B>,
        propagateCancel = false,
    ): Future<Result<B, F | E>> {
        return this.flatMap((value) => {
            return value.match({
                Ok: (value) =>
                    Future.fromPromise(func(value)) as Future<Result<B, F | E>>,
                Error: () => Future.value(value as unknown as Result<B, F | E>),
            });
        }, propagateCancel);
    }

    pipe<A, E, B, F = never>(
        this: Future<Result<A, E>>,
        func: (value: A) => B,
        propagateCancel = false,
    ): Future<Result<B, F | E>> {
        return this.pipeAsync<A, E, B, F>(
            (value: A) => Promise.resolve(func(value)),
            propagateCancel,
        );
    }

    pipeTap<A, E>(
        this: Future<Result<A, E>>,
        func: (value: A) => unknown,
    ): Future<Result<A, E>> {
        this.tap((value) => {
            if (value.isOk()) {
                func(value.value);
            }
        });
        return this;
    }

    pipeTapError<A, E>(
        this: Future<Result<A, E>>,
        func: (value: E) => unknown,
    ): Future<Result<A, E>> {
        this.tap((value) => {
            if (value.isError()) {
                func(value.value);
            }
        });
        return this;
    }

    pipeResult<A, E, B, F = never>(
        this: Future<Result<A, E>>,
        func: (value: A) => Result<B, F>,
        propagateCancel = false,
    ): Future<Result<B, F | E>> {
        return this.map((value) => {
            return value.match({
                Ok: (value) => func(value),
                Error: () => value as unknown as Result<B, E | F>,
            });
        }, propagateCancel);
    }

    pipeTask<A, E, B, F = never>(
        this: Future<Result<A, E>>,
        func: (value: A) => Future<Result<B, F>>,
        propagateCancel = false,
    ): Future<Result<B, F | E>> {
        return this.flatMap((value) => {
            return value.match({
                Ok: (value) => func(value) as Future<Result<B, F | E>>,
                Error: () => Future.value(value as unknown as Result<B, F | E>),
            });
        }, propagateCancel);
    }

    /**
     * Converts the future into a promise
     */
    toPromise(): Promise<A> {
        return new Promise((resolve) => {
            this.onResolve(resolve);
        });
    }

    /**
     * For Future<Result<*>>:
     *
     * Converts the future into a promise (rejecting if in Error)
     */
    resultToPromise<A, E>(this: Future<Result<A, E>>): Promise<A> {
        return new Promise((resolve, reject) => {
            this.onResolve((value) => {
                value.match({
                    Ok: resolve,
                    Error: reject,
                });
            });
        });
    }
}

const futureProto = Object.create(
    null,
    Object.getOwnPropertyDescriptors(Future.prototype),
);
