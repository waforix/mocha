export function toTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}
