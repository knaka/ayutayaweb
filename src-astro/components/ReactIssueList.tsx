import { useState, useEffect } from "react";

type IssueComponentProps = {}

export type IssueAbstract = {
  id: string;
  title: string;
};

declare global {
  interface Window {
    issueAbstracts?: IssueAbstract[];
  }
}

export default (props: IssueComponentProps) => {
  const [issues, setIssues] = useState<IssueAbstract[]>([]);
  useEffect(() => {
    if (window.issueAbstracts) {
      setIssues(window.issueAbstracts);
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
