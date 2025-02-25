import { describe, expect, test } from 'vitest'
import { listPosts } from './posts.js'
import { parse } from 'marked'
import * as fs from 'node:fs';
import fmCjs from 'front-matter';
import * as path from 'node:path';
import { DateTime } from 'luxon';
// isaacs/node-glob: glob functionality for node.js https://github.com/isaacs/node-glob
import { globSync } from 'glob';

// This is a workaround to use front-matter in ESM
const fm = fmCjs as unknown as typeof fmCjs.default;

describe("Posts", () => {
  test('Can list posts', async () => {
    const posts = await listPosts('/Users/knaka/doc');
    // console.log(posts);
    expect(posts.length).toBeGreaterThan(0);
  });
});

type MyAttr = {
  title: string;
  Title: string;
  TITLE: string;

  id: string;
  Id: string;
  ID: string;

  created_at_rfc: string;
  CreatedAtRfc: string;
  CREATED_AT_RFC: string;
};

function extractDateFromPath(filePath: string): string | null {
  const pathParts = filePath.split(path.sep);

  // Search for `doc` in the path
  const docIndex = pathParts.findIndex(part => part === "doc");
  if (docIndex === -1 || docIndex + 2 >= pathParts.length) {
    return null;
  }

  // The next part should be a year
  const year = pathParts[docIndex + 1];
  if (!/^\d{4}$/.test(year)) {
    return null;
  }

  // The next part should be a date
  const monthDayPart = pathParts[docIndex + 2];
  const monthDayMatch = monthDayPart.match(/^(\d{2})(\d{2})/);
  if (! monthDayMatch) {
    return null;
  }

  // Then, return the date in ISO format
  const [, month, day] = monthDayMatch;
  return `${year}-${month}-${day}`;
}

describe("Date extraction", () => {
  test('Can extract date from path', async () => {
    const filePath = '/Users/knaka/doc/2015/0119qiita-b18134d.md';
    const date = extractDateFromPath(filePath);
    expect(date).toBe('2015-01-19');
  });
});

class Markdown {
  title?: string;
  idOriginal?: string;
  id?: string;
  createdAt: DateTime;
  body: string;
  constructor(filePath?: string, zone?: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fmResult = fm<MyAttr>(content);
    const attrs = fmResult.attributes;
    this.title = attrs.title || attrs.Title || attrs.TITLE;
    this.idOriginal = attrs.id || attrs.Id || attrs.ID;
    if (this.idOriginal) {
      this.id = this.idOriginal.slice(0, 7);
    }
    const createdAtRfc = attrs.created_at_rfc || attrs.CreatedAtRfc || attrs.CREATED_AT_RFC;
    if (createdAtRfc) {
      this.createdAt = DateTime.fromISO(createdAtRfc);
    } else {
      if (filePath) {
        const date = extractDateFromPath(filePath);
        if (date) {
          this.createdAt = DateTime.fromISO(date, { zone: zone ?? 'Asia/Tokyo' });
        } else {
          this.createdAt = DateTime.local();
        }
      }
    }
    this.body = fmResult.body;
  };
  bodyHtml() {
    return parse(this.body);
  };
}

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
  });
});
