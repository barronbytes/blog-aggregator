import path from "path";

export function rootDir(): string {
  const filePath = __filename;
  const currentDir = path.dirname(filePath);
  const rootDir = path.resolve(currentDir, "..");
  return rootDir;
}
