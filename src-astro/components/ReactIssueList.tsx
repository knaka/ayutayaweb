import { useState, useEffect } from "react";

type IssueComponentProps = {}

import type { IssueAbstract } from "./types.js";

export default (props: IssueComponentProps) => {
  const [issues, setIssues] = useState<IssueAbstract[]>([]);
  useEffect(() => {
    if (window.__SERVER_DATA__.type === "issues") {
      setIssues(window.__SERVER_DATA__.items);
    }
  }, []);
  return (
    <>
      <button>Create new issue</button>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}><a href={`./issues/${issue.id}`}>{issue.title}</a></li>
        ))}
      </ul>
    </>
  )
};
