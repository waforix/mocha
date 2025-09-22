import { ObjectOrArray } from "./objectOrArray";

type Camel<T extends string> = T extends `${infer U extends Lowercase<string>}${infer V extends Capitalize<string>}`
    ? `${U}${Camel<V>}`
    : Lowercase<T>;

type Snake<T extends string> = T extends `${infer U extends Lowercase<string>}_${infer V extends Lowercase<string>}`
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
/*
function capitalize(input: string): string {
    return input.length > 0
        ? input[0].toUpperCase().concat(input.length > 1 ? input.slice(1) : "")
        : "";
}

function library<T extends API<any>>(object: T): Library<T> {
    return Object.fromEntries(
        Object.entries(object).map((i) => [
            i[0].split("_").map((i, j) => j > 0 ? capitalize(i) : i),
            typeof(i[1] === "object" ? library(i[1]) : i[1])
        ])
    );
}
*/

export function toLibrary<T extends API<Record<string, unknown>>>(object: T): Library<T> {
  return Object.fromEntries(
    Object.entries(object).map((i) => [
      i[0]
        .split('_')
        .map((i) =>  j[0].toUpperCase().concat(j.length > 0 ? j.slice(1) : ''))
        .join('')
        .toLowerCase(),
      i[1],
    ])
  ) as Library<T>;
}

function capitalize(input: string): string {
    console.log(input);
    return input[0]
        ? input[0].toUpperCase().concat(input.length > 1 ? input.slice(1) : "")
        : "";
}

export function library<T extends ObjectOrArray<API<unknown>>>(object: T): ObjectOrArray<Library<unknown>> {
    return (object && Array.isArray(object))
        ? object.map((i) => library(i))
        : (object && typeof(object) === "object")
            ? Object.fromEntries(
                Object.entries(object as Object).map((i) => [
                    ((i[0].split("_")).map((i, j) => (j > 0 && i[0])
                        ? i[0].toUpperCase().concat(i.length > 1 ? i.slice(1) : "")
                        : i).join("")), library(i[1])]))
                        : object;
}




/*

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

*/

const o = {
    first_name: "madeline",
    last_name: "secret",
    account: {
        user_id: 123,
        status: "online",
    },
    private_messages: [
        {
            from_name: "maggie",
            message: "i love you"
        },
        {
            from_name: "madeline",
            message: "i love you too"
        }
    ]
}

const l = library(o);

console.log(l);

