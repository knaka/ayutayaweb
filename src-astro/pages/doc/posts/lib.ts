import { GetStaticPathsResult } from 'astro';
import { obtainStore, Markdown, Order } from '#src/posts.js';

export async function getStaticPathsSub(orders: Order[]): Promise<GetStaticPathsResult> {
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
