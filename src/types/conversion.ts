type Splitter = "_";

type CamelCase<T extends string> =
    T extends `${infer U}${Splitter}${infer V}` ?
        `${Lowercase<CamelCase<U>>}${Capitalize<CamelCase<V>>}` :
    T extends `${infer U}` ? 
        `${Lowercase<U>}` : T;

type SnakeCase<T extends string> =
    T extends `${infer U extends Lowercase<string>}${infer V extends Uppercase<string>}` ?
        `${U}_${SnakeCase<V>}` : T;

export type API<T> = {
    [Property in keyof T as SnakeCase<Property & string>]: T[Property];
}

export type Library<T> = {
    [Property in keyof T as CamelCase<Property & string>]: T[Property];
}