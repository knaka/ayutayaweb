import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";

type WalkDirFunc = (path: string, entry: Dirent) => Promise<void>;

async function walkDir(dir: string, fn: WalkDirFunc): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkDir(entryPath, fn);
      } else {
        await fn(entryPath, entry);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
}

let posts: string[] = [];

async function treatFile(pathEntry: string, entry: Dirent): Promise<void> {
  if (entry.isDirectory()) {
    return;
  }
  if (path.extname(pathEntry) !== ".md") {
    return
  }
  posts.push(pathEntry);
}

export async function listPosts(docDirPath: string): Promise<string[]> {
  // Walk the directory and return a list of post slugs
  await walkDir(docDirPath, treatFile);
  return posts;
};
