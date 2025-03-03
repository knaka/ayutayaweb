"use client";

import { useState, useEffect } from "react";

type Issue = {
  id: number;
  username: string;
  updatedAt: string;
  createdAt: string;
}

export type IssueComponentInfo = {
  issue: Issue;
  message?: string;
}

declare global {
  interface Window {
    __SERVER_DATA__?: IssueComponentInfo;
  }
}

// const MyH1Wrapper = styled.h1`
//   background-color: #ffa0a0;
// `

type IssueComponentProps = {
  className?: string;
}

export default (props: IssueComponentProps) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    if (window.__SERVER_DATA__) {
      setIssue(window.__SERVER_DATA__.issue);
      setMessage(window.__SERVER_DATA__.message || "No Message");
    } else {
      setIssue({
        id: 0,
        username: "No SSG Name",
        updatedAt: "",
        createdAt: "",
      });
    }
    // document.title = "5fa6564 Issue Page";
  }, []);
  return (
    <>
      <div>
      {issue !== null ? (
        <h1>Issue Page for issue with ID: {issue.id}, Name (d0ba5e8): {issue.username}, Message: {message}</h1>
      ) : (
        <h1>Loading...</h1>
      )}
      </div>
    </>
  )
}
