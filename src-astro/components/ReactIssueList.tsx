import { useState, useEffect } from "react";


type IssueComponentProps = {}

export type IssueAbstract = {
  id: string;
  title: string;
};

import { IssueComponentInfo } from "./ReactIssue.js";

declare global {
  interface Window {
    // __SERVER_DATA__?: IssueComponentInfo | IssueAbstract[];
    __SERVER_DATA__?: {
      issueAbstracts: IssueAbstract[];
      issue: IssueComponentInfo;
    }
  }
}

export default (props: IssueComponentProps) => {
  const [issues, setIssues] = useState<IssueAbstract[]>([]);
  useEffect(() => {
    if (window.__SERVER_DATA__ && window.__SERVER_DATA__.issueAbstracts) {
      setIssues(window.__SERVER_DATA__.issueAbstracts);
    }
  }, []);
  return (
    <>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}><a href={`./issues/${issue.id}`}>{issue.title}</a></li>
        ))}
      </ul>        
    </>
  )
};
