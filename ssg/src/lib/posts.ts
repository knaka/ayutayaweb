import { obtainStore, Markdown } from 'lib/posts.js';
import { toBase64 } from 'lib/base64.js';

export function toSafeString(tag: string): string {
  if (/^[a-zA-z0-9_]+$/.test(tag)) {
    return tag.toLowerCase();
  }
  const byteArray = new TextEncoder().encode(tag);
  return toBase64(byteArray.buffer as ArrayBuffer);
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
  const pageSize = 20;
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
          tag = toSafeString(tag);
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
