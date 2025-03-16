import { mkdir, readdir, copyFile, stat, utimes, chmod, lchown } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Copy a directory from src to dest recursively, in archive mode.
 * 
 * @param src 
 * @param dest 
 * @returns 
 */
export async function copyDirAsync(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirAsync(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
      const srcStat = await stat(srcPath);
      await utimes(destPath, srcStat.atime, srcStat.mtime);
      await chmod(destPath, srcStat.mode);
      await lchown(destPath, srcStat.uid, srcStat.gid);
    }
  }
}
