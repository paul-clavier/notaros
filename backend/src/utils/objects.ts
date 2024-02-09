/**
 * Gets nested values in a object
 * @param {any} object
 * @param {string} path - The path written seperated as keys separated by "."
 *
 * @example
 * // returns "baz"
 * get({foo: {bar: "baz"}}, "foo.bar")
 */
export const get = (object: any, path: string) => {
    const keys = path.split(".");
    const firstKey = keys.shift();
    if (firstKey === undefined)
        throw new Error(`Object ${object} cannot access key: ${firstKey}`);
    try {
        const newObject = object[firstKey];

        if (keys.length === 0) return newObject;
        return get(newObject, keys.join("."));
    } catch {
        throw new Error(`Object ${object} cannot access key: ${firstKey}`);
    }
};

/**
 * Gets nested max from an array of objects
 * @param {any} object
 * @param {string} path - The path written seperated as keys separated by ".". It should lead to a numeric value
 *
 * @example
 * // returns 11
 * getMax([{id: 9}, {id: 11}], "id")
 */
export const getMax = (objects: any[], path: string): number | null => {
    if (objects.length === 0) return null;
    const values: any[] = objects.map((object) => get(object, path));
    if (typeof values[0] !== "number") {
        throw new Error(
            `Cannot get max from non-numeric values at path: ${path}`,
        );
    }
    return Math.max(...(values as number[]));
};

/**
 * Gets two arrays and returns an array of tuples
 * @param {any[]} arrayA
 * @param {any[]} arrayB
 *
 * @example
 * // returns [ [ 1, 'a' ], [ 2, 'b' ], [ 3, 'c' ] ] typed as [number, string][]
 * zip([1, 2, 3], ["a", "b", "c", "d"]);
 */
export const zip = <ArrayA extends any[], ArrayB extends any[]>(
    arrayA: ArrayA,
    arrayB: ArrayB,
) => {
    const length = Math.min(arrayA.length, arrayB.length);
    const array = Array(length);
    let index = -1;
    while (++index < length) {
        array[index] = [arrayA[index], arrayB[index]];
    }
    return array as [
        {
            [I in keyof ArrayA]: ArrayA[I] extends infer T ? T : never;
        }[number],
        {
            [I in keyof ArrayB]: ArrayB[I] extends infer T ? T : never;
        }[number],
    ][];
};

export const unzip = <TupleArray extends [any, any][]>(array: TupleArray) => {
    const length = array.length;
    const arrayA = Array(length);
    const arrayB = Array(length);
    let index = -1;
    while (++index < length) {
        const match = array[index];
        if (match !== undefined) {
            arrayA[index] = match[0];
            arrayB[index] = match[1];
        }
    }
    return [arrayA, arrayB] as [
        {
            [I in keyof TupleArray]: TupleArray[I] extends [any, any]
                ? TupleArray[I][0] extends infer T
                    ? T
                    : never
                : never;
        },
        {
            [I in keyof TupleArray]: TupleArray[I] extends [any, any]
                ? TupleArray[I][1] extends infer T
                    ? T
                    : never
                : never;
        },
    ];
};

/**
 *
 * @param value Any value that can be nullable (i.e undefined or null)
 * @returns The value or null if the value is undefined
 */
export const undefinedToNull = <T>(value: T | null | undefined): T | null => {
    if (value === undefined) return null;
    return value;
};

export const nullToUndefined = <T>(
    value: T | null | undefined,
): T | undefined => {
    if (value === null) return undefined;
    return value;
};

/**
 *
 * @param element The base object from which to select the fields
 * @param fields The keys of the fields to select
 * @returns A new object with only the selected fields
 */
export const selectFields = (element: any, fields?: any[]) => {
    if (!fields) return element;
    const result = {};
    fields.forEach((field) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: TS doesn't understand that field is a valid key of T given PathRecord keys are Path types and values are PathType types
        result[field] = get(element, field);
    });
    return result;
};
