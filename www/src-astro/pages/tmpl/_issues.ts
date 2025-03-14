import { type Param as IssueParam } from './_issue.js';

export { tmplIssuesPath as path } from '#src_astro/endpoints.js';

export type Param = IssueParam[];

export const param = '__ISSUES__';
