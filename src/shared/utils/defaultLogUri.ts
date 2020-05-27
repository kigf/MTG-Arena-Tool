export default function defaultLogUri(): string {
  if (process.platform !== "win32") {
    return (
      process.env.HOME +
      "/.wine/drive_c/user/" +
      process.env.USER +
      "/AppData/LocalLow/Wizards of the Coast/MTGA/Player.log"
    );
  }

  const windowsMtgaLogFolder =
    "LocalLow\\Wizards Of The Coast\\MTGA\\Player.log";
  return (
    process.env.APPDATA?.replace("Roaming", windowsMtgaLogFolder) ??
    "c:\\users\\" + process.env.USER + "\\AppData\\" + windowsMtgaLogFolder
  );
}
