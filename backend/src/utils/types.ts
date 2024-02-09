export interface BaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export type Mutable<T extends BaseEntity> = Omit<
    T,
    "id" | "createdAt" | "updatedAt"
>;

export type WithOptional<T, K extends keyof T> = Partial<T> & Omit<T, K>;

export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

export type AsArray<T> = (T & any[]) | T[];

export type WithoutOptional<T> = {
    [K in keyof T]-?: T[K];
};

export type LooseRecord<T> = Record<string | number | symbol, T>;

// Use this class to debug complex types
// https://stackoverflow.com/questions/61412688/how-to-view-full-type-definition-on-hover-in-vscode-typescript#answer-76527542
export type Prettify<T> = {
    [K in keyof T]: T[K];
    // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

// Use this class to debug complex types
// This awesome utility type comes from: https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
// Note it does not work on auto-referencing types like type Toto = { a: Toto };
export type Path<T> = T extends object
    ? {
          [K in keyof T]: K extends T
              ? never
              : `${Exclude<K, symbol>}${"" | `.${Path<T[K]>}`}`;
      }[keyof T]
    : never;

// Use this class to debug complex types
// This awesome utility type comes from: https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
// Note it does not work on auto-referencing types like type Toto = { a: Toto };
export type Leaf<T> = T extends object
    ? {
          [K in keyof T]: K extends T
              ? never
              : `${Exclude<K, symbol>}${Leaf<T[K]> extends never
                    ? ""
                    : `.${Leaf<T[K]>}`}`;
      }[keyof T]
    : never;

// Use this class to debug complex types
export type NestedType<
    T,
    K extends Path<T>,
> = K extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? Rest extends Path<T[Key]>
            ? NestedType<T[Key], Rest>
            : never
        : never
    : K extends keyof T
    ? T[K]
    : never;

/**
 * Gets type for all paths within an object
 * Basically keys of PathRecord<T> are all Path<T> and values are all PathType<T>
 *
 * @example
 * type Toto = { a: { b: string }; c: number };
 * type TotoPathTypes = PathTypes<Toto>;
 * ^? {
 *      { a: { b: string }; c: number; "a.b": string }
 *    }
 */
export type PathRecord<T> = T extends object
    ? {
          [L in Path<T>]: L extends `${string}.${string}`
              ? L extends Path<T>
                  ? NestedType<T, L>
                  : never
              : L extends keyof T
              ? T[L]
              : never;
      }
    : never;

export type PathType<T> = {
    [K in keyof PathRecord<T>]: PathRecord<T>[K];
}[keyof PathRecord<T>];

/**
 * Gets type for all leaves within an object.
 * Basically keys of LeafRecord<T> are all Leaf<T> and values are all LeafType<T>
 *
 * @example
 * type Toto = { a: { b: string }; c: number };
 * type TotoPathTypes = LeafTypes<Toto>;
 * ^? {
 *      { c: number; "a.b": string }
 *    }
 */
export type LeafRecord<T> = T extends object
    ? {
          [L in Leaf<T>]: L extends `${string}.${string}`
              ? L extends Path<T>
                  ? NestedType<T, L>
                  : never
              : L extends keyof T
              ? T[L]
              : never;
      }
    : never;

export type LeafType<T> = {
    [K in keyof LeafRecord<T>]: LeafRecord<T>[K];
}[keyof LeafRecord<T>];
