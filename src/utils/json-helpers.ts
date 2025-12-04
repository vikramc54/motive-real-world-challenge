export type JsonStringified<T> = string & { __fromJsonStringify: T };

export function typedJsonStringify<T>(value: T): JsonStringified<T> {
    return JSON.stringify(value) as JsonStringified<T>;
}

export function typedJsonParse<T>(value: JsonStringified<T>): T {
    return JSON.parse(value) as T;
}
