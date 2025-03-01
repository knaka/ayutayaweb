import { describe, expect, test } from 'vitest'
import { iteratePosts, Markdown } from './posts.js'
import { extractDateFromPath } from './posts.js';

// isaacs/node-glob: glob functionality for node.js https://github.com/isaacs/node-glob
import { globSync } from 'glob';

describe("Date extraction", () => {
  test('Can extract date from path', async () => {
    const filePath = '/Users/knaka/doc/2015/0119qiita-b18134d.md';
    const date = extractDateFromPath(filePath);
    expect(date).toBe('2015-01-19');
  });
});

describe("Markdown", () => {
  test('Can parse markdown', async () => {
    let filePathTgt: string;
    for (const filePath of globSync('/Users/knaka/doc/2015/1019*')) {
      filePathTgt = filePath;
      break;
    }
    const md = new Markdown(filePathTgt, 'Asia/Tokyo');
    expect(md.id).toBe('b18134d');
    expect(md.idOriginal).toBe('b18134d9d11b51da4e2e');
    expect(md.createdAt.toISO()).toBe('2015-10-19T00:00:00.000+09:00');
    expect(md.bodyHtml()).toContain('<p>その過程で目にした');
    expect(md.public).toBe(true);
  });

  test('Private markdown', async () => {
    const md = new Markdown('/Users/knaka/doc/2015/0311qiita-a4cd14b-Vagrantでupされた環境の情報はどこに保存される？.md');
    // const md = new Markdown('/Users/knaka/doc/2021/0908qiita-2f94507-Goで、デバッガのattachまで実行を待機させる.md');
    expect(md.public).toBe(true);
  });

  test('Markdown without public or private', async () => {
    const md = new Markdown('/Users/knaka/doc/2021/1000.md');
    expect(md.public).toBe(false);
  });
});

describe("Posts", () => {
  test('Can list posts', async () => {
    let count = 0;
    for await (const _md of iteratePosts(
      '/Users/knaka/doc/2019',
      '/Users/knaka/doc/2020',
      '/Users/knaka/doc/2021',
    )) {
      count++;
    }
    console.log(`count: ${count}`);
    expect(count).toBeGreaterThan(0);
  });
});
