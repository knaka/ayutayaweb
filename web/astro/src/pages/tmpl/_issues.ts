import { type Param as IssueParam } from './_issue.js';

export { tmplIssuesPath as path } from '#astro//endpoints.js';

export type Param = IssueParam[];

export const param = '__ISSUES__';
