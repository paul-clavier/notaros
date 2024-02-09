interface ObjectNotFound {
    id?: number;
}

export class ObjectNotFoundError<T extends ObjectNotFound> extends Error {
    constructor(objectName: string, objectProperties: T) {
        super(
            `[ObjectNotFoundError] ${objectName}: ${JSON.stringify(
                objectProperties,
            )} not found`,
        );
    }
}

export class ErrorWithCode extends Error {
    code: string;
    constructor(message: string, code: string) {
        super(message);
        this.code = code;
    }
}
