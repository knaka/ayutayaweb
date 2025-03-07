"use client";

import { useState, useEffect } from "react";

import styles from './ReactIssue.module.scss'

export type Issue = {
  id: string;
  title: string;
  description: string;
}

declare global {
  interface Window {
    issue?: Issue;
  }
}

type IssueComponentProps = {
  className?: string;
}

export default (props: IssueComponentProps) => {
  const [issue, setIssue] = useState<Issue | null>(null);
  useEffect(() => {
    if (window.issue) {
      setIssue(window.issue);
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
