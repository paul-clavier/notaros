import { Future } from "./future";
import { Result } from "./result";

export * from "./future";
export * from "./option";
export * from "./pipe";
export * from "./result";

export type Task<A, E> = Future<Result<A, E>>;
