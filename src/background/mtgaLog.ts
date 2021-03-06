import fs from "fs";
import { promisify } from "util";

const fsPromises = {
  access: promisify(fs.access),
  stat: promisify(fs.stat),
  open: promisify(fs.open),
  read: promisify(fs.read),
};

export async function exists(path: fs.PathLike): Promise<boolean> {
  try {
    await fsPromises.access(path, fs.constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export async function stat(path: fs.PathLike): Promise<fs.Stats> {
  return await fsPromises.stat(path);
}

export async function readSegment(
  path: fs.PathLike,
  start: number | null,
  length: number
): Promise<string> {
  const fd = await fsPromises.open(path, "r");
  try {
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await fsPromises.read(fd, buffer, 0, length, start);
    return buffer.toString("utf-8", 0, bytesRead);
  } finally {
    fs.close(fd, () => {});
  }
}
