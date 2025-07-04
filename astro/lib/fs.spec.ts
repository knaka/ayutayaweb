import { describe, test, expect } from 'vitest'
import { copyDirAsync } from './fs.js';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

async function dirExistsAsync(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function compareDirsAsync(src: string, dest: string): Promise<boolean> {
  const srcEntries = await readdir(src, { withFileTypes: true });
  const destEntries = await readdir(dest, { withFileTypes: true });

  if (srcEntries.length !== destEntries.length) return false;

  for (const entry of srcEntries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!(await compareDirsAsync(srcPath, destPath))) return false;
    } else if (entry.isFile()) {
      const srcStat = await stat(srcPath);
      const destStat = await stat(destPath);
      if (srcStat.size !== destStat.size) {
        console.log('size', srcPath, srcStat.size, destStat.size);
        return false;
      }
      if (srcStat.mode !== destStat.mode) {
        console.log('mode', srcPath, srcStat.mode, destStat.mode);
        return false;
      }
      if (srcStat.mtime.getTime() !== destStat.mtime.getTime()) {
          console.log('mtime', srcPath, srcStat.atime.getTime(), destStat.atime.getTime());
        return false;
      }
      if (srcStat.atime.getTime() !== destStat.atime.getTime()) {
        console.log('atime', srcPath, srcStat.atime.getTime(), destStat.atime.getTime());
        return false;
      }
    }
  }
  return true;
}

async function countFilesAsync(dir: string): Promise<number>  {
  let count = 0;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await countFilesAsync(join(dir, entry.name));
    } else if (entry.isFile()) {
      count++;
    }
  }
  return count;
}

describe('copyDirAsync', () => {
  test('Should copy a directory recursively', async () => {
    const srcDir = join(__dirname, 'testdata', 'copy');
    const destDir = join(tmpdir(), 'destDir');
    await copyDirAsync(srcDir, destDir);
    expect(await countFilesAsync(destDir)).toBe(4);
    expect(await dirExistsAsync(destDir)).toBeTruthy();
    expect(await compareDirsAsync(srcDir, destDir)).toBeTruthy();
  });
});
