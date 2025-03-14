let base = '';
if (import.meta.env && import.meta.env.BASE_URL) {
  base = import.meta.env.BASE_URL.replace(/\/$/, '');
}

export const postsPath = `${base}/posts`;
export const issuesPath = `${base}/var/issues`;

export const tmplIssuePath = `${base}/tmpl/issue`;
export const tmplIssuesPath = `${base}/tmpl/issues`;
