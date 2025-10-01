export function toTimestamp(date: Date): Date | number {
  return date;
}

export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}
