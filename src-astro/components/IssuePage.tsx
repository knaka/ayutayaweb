"use client";

import { useState, useEffect } from "react";

type Issue = {
  id: number;
  username: string;
  updatedAt: string;
  createdAt: string;
}

export type IssuePageInfo = {
  issue: Issue;
  message?: string;
}

declare global {
  interface Window {
    __SERVER_DATA__?: IssuePageInfo;
  }
}

export default () => {
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
      {issue !== null ? (
        <h1>Issue Page for issue with ID: {issue.id}, Name: {issue.username}, Message: {message}</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  )
}
