import { readFileSync, Dirent, promises as fs } from "node:fs";
import { parse } from 'marked';
// import * as fs from 'node:fs';
import * as path from 'node:path';
import { DateTime } from 'luxon';

// This is a workaround to use front-matter in ESM
import fmCjs from 'front-matter';
const fm = fmCjs as unknown as typeof fmCjs.default;

async function listFilePathsRec(dir: string): Promise<string[]> {
  const paths: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...await listFilePathsRec(entryPath));
    } else {
      paths.push(entryPath);
    }
  }
  return paths;
}

export async function* iteratePosts(...docDirPaths: string[]): AsyncGenerator<Markdown> {
  for (const docDirPath of docDirPaths) {
    for await (const filePath of await listFilePathsRec(docDirPath)) {
      if (path.extname(filePath) !== ".md") {
        continue;
      }
      const md = new Markdown(filePath);
      if (!md.public) {
        continue;
      }
      yield md;
    }
  }
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
  title?: string;
  idOriginal?: string;
  id?: string;
  public: boolean;
  createdAt: DateTime;
  body: string;
  tags: string[];
  constructor(filePath?: string, zone?: string) {
    const content = readFileSync(filePath, 'utf-8');
    const fmResult = fm<Attributes>(content);
    const attrs = fmResult.attributes;
    this.title = attrs.title || attrs.Title || attrs.TITLE;
    this.idOriginal = attrs.id || attrs.Id || attrs.ID;
    if (
      attrs.private == undefined && attrs.Private == undefined && attrs.PRIVATE == undefined &&
      attrs.public == undefined && attrs.Public == undefined && attrs.PUBLIC == undefined
    ) {
      this.public = false;
    } else if (attrs.public || attrs.Public || attrs.PUBLIC) {
      this.public = true;
    } else if (!attrs.private || !attrs.Private || !attrs.PRIVATE) {
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
    this.body = fmResult.body;
    const tags = attrs.tags || attrs.Tags || attrs.TAGS;
    this.tags = tags ? tags.split(/\s*[,|]\s*/): []; 
  };
  bodyHtml() {
    return parse(this.body);
  };
}
