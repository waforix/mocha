export type Payload = {
  op: number;
  // biome-ignore lint/suspicious/noExplicitAny: any type expected for gateway payload data
  d: any;
  s?: number;
  t?: string;
};
