export { tmplIssuePath as path } from '#src_astro/endpoints.js';

export type Param = {
  id: string;
  title: string;
  description: string;
}

export const param = '__ISSUE__';
