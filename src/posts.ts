import { readFileSync, promises as fs, statSync } from "node:fs";
import { globSync } from 'glob';
import { parse } from 'marked';
// import * as fs from 'node:fs';
import * as path from 'node:path';
import { DateTime } from 'luxon';

// This is a workaround to use front-matter in ESM
import fmCjs from 'front-matter';
const fm = fmCjs as unknown as typeof fmCjs.default;

let latest: Date = null;

async function listFilePathsRec(dir: string): Promise<string[]> {
  const paths: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...await listFilePathsRec(entryPath));
    } else {
      paths.push(entryPath);
      const stat = await fs.stat(entryPath);
      if (!latest || stat.mtime > latest) {
        latest = stat.mtime;
      }
    }
  }
  return paths;
}

type Attributes = {
  title: string;
  Title: string;
  TITLE: string;

  id: string;
  Id: string;
  ID: string;

  created_at_rfc: string;
  CreatedAtRfc: string;
  CREATED_AT_RFC: string;

  private: boolean;
  Private: boolean;
  PRIVATE: boolean;

  public: boolean;
  Public: boolean;
  PUBLIC: boolean;

  tags: string;
  Tags: string;
  TAGS: string;
};

export function extractDateFromPath(filePath: string): string | null {
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
  if (!monthDayMatch) {
    return null;
  }

  // Then, return the date in ISO format
  const [, month, day] = monthDayMatch;
  return `${year}-${month}-${day}`;
}

export class Markdown {
  filePath: string;
  title?: string;
  idOriginal?: string;
  id?: string;
  public: boolean = false;
  createdAt: DateTime;
  modifiedAt: DateTime;
  tags: string[];
  constructor(filePath?: string, zone?: string) {
    this.filePath = filePath;
    // Set the modification time of the file.
    this.modifiedAt = DateTime.fromJSDate(statSync(filePath).mtime);
    const content = readFileSync(filePath, 'utf-8');
    const fmResult = fm<Attributes>(content);
    const attrs = fmResult.attributes;
    this.title = attrs.title || attrs.Title || attrs.TITLE;
    this.idOriginal = attrs.id || attrs.Id || attrs.ID;
    if (
      attrs.public === true ||
      attrs.Public === true ||
      attrs.PUBLIC === true
    ) {
      this.public = true;
    } else if (
      attrs.private === false ||
      attrs.Private === false ||
      attrs.PRIVATE === false
    ) {
      this.public = true;
    }
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
    const tags = attrs.tags || attrs.Tags || attrs.TAGS;
    this.tags = tags ? tags.split(/\s*[,|]\s*/): []; 
    // this.body = fmResult.body;
  };
  body() {
    const content = readFileSync(this.filePath, 'utf-8');
    const fmResult = fm(content);
    return fmResult.body;
  }
  bodyHtml() {
    return parse(this.body());
  };
}

export async function createMarkdownFromGlobPattern(globPattern: string, zone?: string): Promise<Markdown> {
  const filePaths = globSync(globPattern);
  if (filePaths.length === 0) {
    throw new Error(`No file found for ${globPattern}`);
  }
  const filePath: string = filePaths[0] as string;
  return new Markdown(filePath, zone);
}

// order := asc | desc
export type PostOrder = 'asc' | 'desc';

export class PostStore {
  #directoryPaths: string[];
  constructor(...directoryGlobPatterns: string[]) {
    for (const directoryGlobPattern of directoryGlobPatterns) {
      this.#directoryPaths.push(...globSync(directoryGlobPattern));
    }
  }
  #posts?: Markdown[] = null;
  async postsAsync(order: PostOrder = 'desc'): Promise<Markdown[]> {
    if (!this.#posts) {
      this.#posts = [];
      for (const docDirPath of this.#directoryPaths) {
        for await (const filePath of await listFilePathsRec(docDirPath)) {
          if (path.extname(filePath) !== ".md") {
            continue;
          }
          const md = new Markdown(filePath);
          if (!md.public) {
            continue;
          }
          this.#posts.push(md);
        }
      }
    }
    return this.#posts.sort((a, b) => {
      if (order === 'asc') {
        return (a.createdAt > b.createdAt) ? 1 : -1;
      } else {
        return (a.createdAt < b.createdAt) ? 1 : -1;
      }
    });
  }
  async postsMapAsync(): Promise<Map<string, Markdown>> {
    const posts = await this.postsAsync();
    const map = new Map<string, Markdown>();
    for (const post of posts) {
      map.set(post.id, post);
    }
    return map;
  }
};
