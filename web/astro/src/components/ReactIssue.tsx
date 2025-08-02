import { useState, useEffect } from "react";

import styles from './ReactIssue.module.scss'

import { param, type Param } from '#astro//pages/tmpl/_issue.js';

export default () => {
  const issue = (typeof window !== "undefined" && window[param])?
    window[param] as Param:
    {
      id: 'deadbeef',
      title: 'No title',
      description: 'No description',
    } as Param
  ;
  useEffect(() => {
    document.title = issue ?`Issue: ${issue.title}`: "No issue data";
  }, [issue]);
  return (
    <>
      <h1 className={styles.green}>Issue Page for issue with ID: {issue.id}, Title: {issue.title}, Description: {issue.description}</h1>
    </>
  )
}
