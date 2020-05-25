function getTwoDigitString(val: number): string {
  return (val < 10 ? "0" : "") + val;
}

export function toMMSS(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const minutesStr = getTwoDigitString(minutes);
  const secondsStr = getTwoDigitString(seconds);
  if (hours > 0) {
    return hours + ":" + minutesStr + ":" + secondsStr;
  } else {
    return minutes + ":" + secondsStr;
  }
}

export function toDDHHMMSS(sec_num: number): string {
  const dd = Math.floor(sec_num / 86400);
  const hh = Math.floor((sec_num - dd * 86400) / 3600);
  const mm = Math.floor((sec_num - dd * 86400 - hh * 3600) / 60);
  const ss = sec_num - dd * 86400 - hh * 3600 - mm * 60;

  const days = dd + (dd > 1 ? " days" : " day");
  const hours = hh + (hh > 1 ? " hours" : " hour");
  const minutes = mm + (mm > 1 ? " minutes" : " minute");
  const seconds = ss + (ss > 1 ? " seconds" : " second");

  return `${dd > 0 ? days + ", " : ""}
${hh > 0 ? hours + ", " : ""}
${minutes}, 
${seconds}`;
}

export function toHHMMSS(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const hoursStr = getTwoDigitString(hours);
  const minutesStr = getTwoDigitString(minutes);
  const secondsStr = getTwoDigitString(seconds);
  return hoursStr + ":" + minutesStr + ":" + secondsStr;
}

export function toHHMM(sec_num: number): string {
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const hoursStr = getTwoDigitString(hours);
  const minutesStr = getTwoDigitString(minutes);
  return hoursStr + ":" + minutesStr;
}
