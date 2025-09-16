type Splitter = "_";

type CamelCase<T extends string> =
    T extends `${infer U}${Splitter}${infer V}` ?
        `${Lowercase<CamelCase<U>>}${Capitalize<CamelCase<V>>}` :
    T extends `${infer U}` ? 
        `${Lowercase<U>}` : T;

type SnakeCase<T extends string> =
    T extends `${infer U extends Lowercase<string>}${infer V extends Uppercase<string>}` ?
        `${U}_${SnakeCase<V>}` : T;


/*
 * TAPI<T>, TLibrary<T>
 * 
 * Create a new type from an existing type, converting the
 * original type's properties from snake_case to camelCase
 * or vice-versa.
 * 
 * Usage:
 * type SomeLibraryType = TLibrary<SomeAPIType>;
 * type SomeAPIType = TAPI<SomeLibraryType>;
 * 
 */

export type TAPI<T> = {
    [Property in keyof T as SnakeCase<Property & string>]: T[Property];
}

export type TLibrary<T> = {
    [Property in keyof T as CamelCase<Property & string>]: T[Property];
}