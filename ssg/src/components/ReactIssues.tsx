import { param, type Param } from '#/pages/tmpl/_issues.js';
import { issuesPath } from '#/endpoints.js';

export default () => {
  const issues = (typeof window !== "undefined" && window[param])?
    window[param] as Param:
    [
      {
        id: 'deadbeef',
        title: 'No title',
        description: '',
      }
    ] as Param
  ;
  return (
    <>
      <button>Create new issue</button>
      <ul>{issues.map((issue) => (
        <li key={issue.id}><a href={`${issuesPath}/${issue.id}`}>{issue.title}</a></li>
      ))}</ul>
    </>
  )
};
