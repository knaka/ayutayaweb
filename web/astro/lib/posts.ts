import { readFileSync, promises as fs, statSync } from "node:fs";
import { globSync } from 'glob';
import { Marked, parse } from 'marked';
import markedShiki from 'marked-shiki'
import { createHighlighter } from 'shiki';
// import * as fs from 'node:fs';
import * as path from 'node:path';
import { DateTime } from 'luxon';
import { getSingletonHighlighter } from "shiki";

// setOptions({
//   highlight: (code, lang) => {
//     return highlighter.codeToHtml(code, { lang });
//   },
// });

// This is a workaround to use front-matter in ESM
import fmCjs from 'front-matter';
const fm = fmCjs as unknown as typeof fmCjs.default;

let latest: Date | null = null;

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

const highlighter = await createHighlighter({
  // In this case, we include the "js" language specifier to ensure that
  // Shiki applies the appropriate syntax highlighting for Markdown code
  // blocks.
  langs: ['md', 'js', 'go', 'sh', 'bash'],
  themes: ['github-dark-dimmed']
})

const loadedLanguages = new Set(highlighter.getLoadedLanguages());

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
    this.modifiedAt = DateTime.fromJSDate(statSync(filePath).mtime);
    const content = readFileSync(filePath, 'utf-8');
    const fmResult = (() => {
      try {
        return fm<Attributes>(content);
      } catch (e) {
        console.error(`Failed to parse ${filePath}`, e);
      }
    })();
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
  async bodyHtml(): Promise<string> {
    // const highlighter = await getSingletonHighlighter({})
    // return parse(this.body(), {
    //   async: true,
    //   // highlight: (code, lang, callback) {
    //   //   return highlighter.codeToHtml(code, { lang })
    //   // }
    // });
    return await new Marked()
      .use(markedShiki({
        highlight(code, lang, props) {
          let filename = '';
          if (!lang) {
            lang = 'plaintext';
          } else {
            const divs = lang.split(':', 2);
            if (divs.length == 2) {
              lang = divs[0];
              filename = divs[1];
            }
            if(!loadedLanguages.has(lang)) {
              lang = 'plaintext';
            }
          }
          return highlighter.codeToHtml(code, {
            lang,
            theme: 'github-dark-dimmed',
            meta: { __raw: props.join(' ') }, // required by `transformerMeta*`
            transformers: []
          })
        }
      }))
      .parse(this.body());
  };
}

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 */
export async function createMarkdownFromGlobPattern(globPattern: string, zone?: string): Promise<Markdown> {
  const filePaths = globSync(globPattern);
  if (filePaths.length === 0) {
    throw new Error(`No file found for ${globPattern}`);
  }
  const filePath: string = filePaths[0] as string;
  return new Markdown(filePath, zone);
}

export type Order = 'asc' | 'desc';

export class Store {
  #directoryPaths: string[] = [];
  constructor(...directoryGlobPatterns: string[]) {
    for (const directoryGlobPattern of directoryGlobPatterns) {
      this.#directoryPaths.push(...globSync(directoryGlobPattern));
    }
  }
  #posts?: Markdown[] = null;
  async postsAsync({
    order = 'desc',
    year,
  }: {
    order?: Order,
    year?: number,
  } = {}): Promise<Markdown[]> {
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
    const posts =
      (year)? this.#posts.filter(post => post.createdAt.year === year):
      [...this.#posts];
    posts.sort((a, b) => {
      if (order === 'asc') {
        return (a.createdAt > b.createdAt) ? 1 : (a.createdAt < b.createdAt) ? -1 : (a.id > b.id) ? 1 : -1;
      } else {
        return (a.createdAt < b.createdAt) ? 1 : (a.createdAt > b.createdAt) ? -1 : (a.id > b.id) ? 1 : -1;
      }
    });
    return posts;
  }
  #postsMap?: Map<string, Markdown> = null;
  async postsMapAsync(): Promise<Map<string, Markdown>> {
    if (!this.#postsMap) {
      this.#postsMap = new Map<string, Markdown>();
      const posts = await this.postsAsync();
      for (const post of posts) {
        this.#postsMap.set(post.id, post);
      }
    }
    return this.#postsMap;
  }
  async postAsync(id: string): Promise<Markdown> {
    const postsMap = await this.postsMapAsync();
    return postsMap.get(id);
  }
};

let store: Store | null = null;

export function obtainStore(directoryGlobPatterns: string[] = []): Store {
  if (!store) {
    if (directoryGlobPatterns.length === 0) {
      const patterns = import.meta.env.PUBLIC_PSV_DOC_DIR_GLOB_PATTERN as string;
      if (patterns) {
        directoryGlobPatterns = patterns.split('|');
      }
    }
    store = new Store(...directoryGlobPatterns);
  }
  return store;
}
