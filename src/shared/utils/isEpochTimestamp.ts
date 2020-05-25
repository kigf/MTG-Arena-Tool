// Im not sure if this would be better as a converter instead of a check
export default function isEpochTimestamp(timestamp: number): boolean {
  const asDate = new Date(timestamp);
  // Even if we have a date in epoch between 2000 and
  // 2100 it will be parsed as 1970.
  return asDate && asDate == asDate && asDate.getUTCFullYear() < 2000;
}
