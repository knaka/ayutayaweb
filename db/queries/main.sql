-- name: NewIssueAsync :exec
INSERT INTO issues (
  title,
  description,
  updated_at
) VALUES (
  ?,
  ?,
  datetime('now')
);

-- name: IssueAsync :one
SELECT *
FROM issues
WHERE
  ? = issues.id
;

-- name: UpdateIssueAsync :exec
UPDATE issues
SET
  title = ?,
  description = ?,
  updated_at = datetime('now')
WHERE
  CAST(sqlc.narg(opt_id) AS integer) = issues.id OR
  CAST(sqlc.narg(opt_title) AS text) = issues.title
