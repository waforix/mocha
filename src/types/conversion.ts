type Splitter = '_';



enum CaseType {
    CAMEL,
    SNAKE
}

type Camel<T extends string> = T extends `${infer U extends Lowercase<string>}${infer V extends Capitalize<string>}`
    ? `${U}${Camel<V>}`
    : Lowercase<T>;

type Snake<T extends string> = T extends `${infer U extends Lowercase<string>}_${infer V extends Lowercase<string>}`
    ? `${U}_${Snake<V>}`
    : Lowercase<T>;

const s = "snake_string";
const c = "camelString";

function f(s: Snake<string>) {}

f(s);
f(c);


type Case<T extends string> = Camel<T> | Snake<T>;

type CamelCase<T extends string> = T extends `${infer U}${Splitter}${infer V}`
  ? `${Lowercase<CamelCase<U>>}${Capitalize<CamelCase<V>>}`
  : T extends `${infer U}`
    ? `${Lowercase<U>}`
    : T;


type SnakeCase<T extends string> =
  T extends `${infer U extends Lowercase<string>}${infer V extends Uppercase<string>}`
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

export function toLibrary<T extends API<Record<string, unknown>>>(object: T): Library<T> {
  return Object.fromEntries(
    Object.entries(object).map((i) => [
      i[0]
        .split('_')
        .map((j) => j[0].toUpperCase().concat(j.length > 0 ? j.slice(1) : ''))
        .join('')
        .toLowerCase(),
      i[1],
    ])
  ) as Library<T>;
}
