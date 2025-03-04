import { GetStaticPathsResult } from 'astro';
import { obtainStore, Markdown, Order } from '#src/posts.js';

/**
 * https://stackoverflow.com/a/78552144
 *
 * @param {ArrayBuffer} buffer
 * @return {string}
 */
function toBase64(buffer: ArrayBuffer): string {
  const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  const byteLength = buffer.byteLength;
  const bufferView = new Uint8Array(buffer);
  const remainingBytesCount = byteLength % 3;
  const mainLength = byteLength - remainingBytesCount;

  let string = "";
  let i = 0;
  for (; i < mainLength; i += 3) {
      const chunk = (bufferView[i] << 16) | (bufferView[i + 1] << 8) | bufferView[i + 2];
      string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
      string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
      string += base64Chars[(chunk & 0b000000000000111111000000) >> 6];
      string += base64Chars[(chunk & 0b000000000000000000111111)];
  }
  if (remainingBytesCount === 2) {
      const chunk = (bufferView[i] << 16) | (bufferView[i + 1] << 8);
      string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
      string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
      string += base64Chars[(chunk & 0b000000000000111111000000) >> 6];
      string += "=";
  } else if (remainingBytesCount === 1) {
      const chunk = (bufferView[i] << 16);
      string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
      string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
      string += "==";
  }
  return string;
}

export function toOnUrl(tag: string): string {
  if (/^[a-zA-z0-9_]+$/.test(tag)) {
    return tag.toLowerCase();
  }
  const byteArray = new TextEncoder().encode(tag);
  return toBase64(byteArray.buffer as ArrayBuffer);
}

export async function getPostStaticPaths(orders: Order[]): Promise<GetStaticPathsResult> {
  const store = obtainStore()
  const result: GetStaticPathsResult = [];
  for (const order of orders as Order[]) {
    const posts = await store.postsAsync({ order });
    const yearPosts: Map<number, Markdown[]> = new Map();
    posts.forEach((post) => {
      const year = post.createdAt.year;
      if (!yearPosts.has(year)) {
        yearPosts.set(year, []);
      }
      yearPosts.get(year).push(post);
    });
    result.push(...Array.from(yearPosts.keys()).map((year) => ({
      params: {
        year: year.toString(),
        order,
      },
      props: {
        posts: yearPosts.get(year),
      },
    })));
  }
  return result;
}

import { PaginateFunction } from 'astro';

export async function getStaticPathsSub({
  paginate,
  param = null,
}: {
  paginate: PaginateFunction,
  param?: 'year' | 'tag',
}) {
  const store = obtainStore()
  const posts = await store.postsAsync({ order: 'desc' });
  const pageSize = 30;
  switch (param) {
    case 'year': {
      const yearPosts: Map<number, Markdown[]> = new Map();
      posts.forEach((post) => {
        const year = post.createdAt.year;
        if (!yearPosts.has(year)) {
          yearPosts.set(year, []);
        }
        yearPosts.get(year).push(post);
      });
      return Array.from(yearPosts.keys()).flatMap(year =>
        paginate(yearPosts.get(year), {
          params: { 
            year: year.toString(),
          },
          pageSize
        })
      );
    }
    case 'tag': {
      const tagPosts: Map<string, Markdown[]> = new Map();
      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          tag = toOnUrl(tag);
          if (!tagPosts.has(tag)) {
            tagPosts.set(tag, []);
          }
          tagPosts.get(tag).push(post);
        });
      });
      return Array.from(tagPosts.keys()).flatMap(tag =>
        paginate(tagPosts.get(tag), {
          params: {
            tag: encodeURIComponent(tag),
          },
          pageSize
        })
      );
    }
    default:
      break;
  }
  return paginate(posts, { pageSize });
}
