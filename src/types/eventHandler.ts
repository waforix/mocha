// @ts-expect-error
// biome-ignore lint/suspicious/noExplicitAny: Type is meant to be compatible with any Object
export type EventHandler = (...args: any) => Promise<void>;