export default function makeId(length: number): string {
  let ret = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++)
    ret += possible.charAt(Math.floor(Math.random() * possible.length));

  return ret;
}
