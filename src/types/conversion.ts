import type { ObjectOrArray } from './objectOrArray';

type Camel<T extends string> =
  T extends `${infer U extends Lowercase<string>}${infer V extends Capitalize<string>}`
    ? `${U}${Camel<V>}`
    : Lowercase<T>;

type Snake<T extends string> =
  T extends `${infer U extends Lowercase<string>}_${infer V extends Lowercase<string>}`
    ? `${U}_${Snake<V>}`
    : Lowercase<T>;

type Case<T extends string> = Camel<T> | Snake<T>;

type CamelCase<T extends string> = T extends `${infer U}_${infer V}`
  ? `${Lowercase<CamelCase<U>>}${Capitalize<CamelCase<V>>}`
  : T extends `${infer U}`
    ? `${Lowercase<U>}`
    : T;

type SnakeCase<T extends string> =
  T extends `${infer U extends Lowercase<string>}${infer V extends Capitalize<string>}`
    ? `${U}_${SnakeCase<V>}`
    : T;

export type API<T> = {
  [Property in keyof T as SnakeCase<Property & string>]: T[Property] extends Record<string, unknown>
    ? API<T[Property]>
    : T[Property];
};

export type Library<T> = {
  [Property in keyof T as CamelCase<Property & string>]: T[Property] extends Record<string, unknown>
    ? Library<T[Property]>
    : T[Property];
};

export function library<T extends ObjectOrArray<API<unknown>>>(
  object: T
): ObjectOrArray<Library<unknown>> {
  return object && Array.isArray(object)
    ? object.map((i) => library(i))
    : object && typeof object === 'object'
      ? Object.fromEntries(
          Object.entries(object as Object).map((i) => [
            i[0]
              .split('_')
              .map((i, j) =>
                j > 0 && i[0] ? i[0].toUpperCase().concat(i.length > 1 ? i.slice(1) : '') : i
              )
              .join(''),
            library(i[1]),
          ])
        )
      : object;
}
