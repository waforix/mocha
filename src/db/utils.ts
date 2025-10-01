export function toTimestamp(date: Date): Date {
  return date;
}


export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}
