import { ErrorWithCode } from "@/utils/error";
import { logger } from "@/utils/logger";
import { selectFields, undefinedToNull } from "@/utils/objects";
import { BaseEntity, Mutable, Nullable, Path } from "@/utils/types";

interface Where<T extends BaseEntity> {
    where: Partial<T>;
}

interface Create<T extends BaseEntity> {
    data: Mutable<T>;
}

interface Update<T extends BaseEntity> {
    data: Partial<Nullable<T>>;
}

interface Upsert<T extends BaseEntity> {
    create: Create<T>["data"];
    update: Update<T>["data"];
}

//copilot-generated
export function Spied() {
    return function (target: any, propertyKey: string) {
        const originalMethod = target[propertyKey];
        target[propertyKey] = jest.fn(function (...args: any[]) {
            return originalMethod.apply(this, args);
        });
    };
}

//copilot-generated
export function SpyAllMethods<T extends { new (...args: any[]): unknown }>(
    constructor: T,
) {
    for (const propName of Object.getOwnPropertyNames(constructor.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(
            constructor.prototype,
            propName,
        );
        if (
            descriptor &&
            typeof descriptor.value === "function" &&
            propName !== "constructor"
        ) {
            Spied()(constructor.prototype, propName);
        }
    }
    return constructor;
}

export class MockRepository<T extends BaseEntity> {
    private data: T[] = [];

    private matchElement = (element: T, filter: Where<T>): boolean => {
        const keys = Object.keys(filter.where) as (keyof T)[];
        return keys.every((key) => element[key] === filter.where[key]);
    };

    private getElement = (filter: Where<T>): T | null => {
        return undefinedToNull(
            this.data.find((element) => this.matchElement(element, filter)),
        );
    };

    private throwIfNull = (entity: T | null): T => {
        if (entity === null) {
            throw new ErrorWithCode("Entity not found", "P2025");
        }
        return entity;
    };

    private getNextId = () => {
        if (this.data.length === 0) return 1;
        const ids = this.data.map((element) => element.id);
        return Math.max(...ids) + 1;
    };

    public cleanUp = () => {
        this.data = [];
    };

    public logData = (fields?: Path<T>[]) => {
        logger.log(
            "Test",
            this.constructor.name,
            JSON.stringify(
                this.data.map((element) => selectFields(element, fields)),
            ),
        );
    };

    public _findUnique = (filter: Where<T>): T | null => {
        return this.getElement(filter);
    };

    public _findUniqueOrThrow = (filter: Where<T>): T => {
        const entity = this._findUnique(filter);
        return this.throwIfNull(entity);
    };

    public _findFirst = (filter: Where<T>): T | null => {
        return this.getElement(filter);
    };

    public _findFirstOrThrow = (filter: Where<T>): T => {
        const entity = this._findFirst(filter);
        return this.throwIfNull(entity);
    };

    public _findMany = (filter: Where<T>): T[] => {
        return this.data.filter((element) =>
            this.matchElement(element, filter),
        );
    };

    public _create = ({ data }: Create<T>): T => {
        const now = new Date();
        const newEntity = {
            id: this.getNextId(),
            createdAt: now,
            updatedAt: now,
            ...data,
        } as T;
        this.data.push(newEntity);
        return newEntity;
    };

    public _update = ({ data, where }: Update<T> & Where<T>): T => {
        const index = this.data.findIndex((element) =>
            this.matchElement(element, { where }),
        );
        this.data[index] = { ...this.data[index], ...data };
        return this.data[index];
    };

    public _upsert = ({ where, create, update }: Upsert<T> & Where<T>): T => {
        const entity = this._findUnique({ where });
        if (entity === null) {
            return this._create({ data: create });
        }
        return this._update({ data: { ...entity, ...update }, where });
    };

    public _delete = (filter: Where<T>): T => {
        let entity = this._findFirst(filter);
        entity = this.throwIfNull(entity);
        this.data = this.data.filter(
            (element) => !this.matchElement(element, filter),
        );
        return entity;
    };
}
