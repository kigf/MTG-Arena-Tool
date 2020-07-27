import { constants } from "mtgatool-shared";

const { FORMATS } = constants;

export default function getReadableFormat(format: string): string {
  if (format in FORMATS) {
    return FORMATS[format];
  }
  return format || "Unknown";
}
