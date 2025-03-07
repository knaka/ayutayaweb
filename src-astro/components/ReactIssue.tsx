"use client";

import { useState, useEffect } from "react";

import styles from './ReactIssue.module.scss'

import type { Issue } from './types.js'

type IssueComponentProps = {
  className?: string;
}

export default (props: IssueComponentProps) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  useEffect(() => {
    if (window.__SERVER_DATA__?.type === "issue") {
      setIssue(window.__SERVER_DATA__);
    }
  }, []);
  return (
    <>
      <div>
      {issue !== null ? (
        <h1 className={styles.green}>Issue Page for issue with ID: {issue.id}, Title: {issue.title}, Description: {issue.description}</h1>
      ) : (
        <h1 className={styles.red}>Loading...</h1>
      )}
      </div>
    </>
  )
}
