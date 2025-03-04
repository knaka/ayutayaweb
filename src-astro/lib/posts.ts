import { GetStaticPathsResult } from 'astro';
import { obtainStore, Markdown, Order } from '#src/posts.js';

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
          tag = tag.toLowerCase();
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
