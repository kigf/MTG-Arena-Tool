export default function replaceAll(
  str: string,
  find: string,
  replace: string
): string {
  return str.replace(new RegExp(find, "g"), replace);
}
