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

-- name: IssuesAsync :many
SELECT *
FROM Issues
ORDER BY id
;

-- name: UpdateIssueAsync :exec
UPDATE issues
SET
  title = CASE WHEN CAST(sqlc.narg(opt_title) AS text) IS NOT NULL THEN sqlc.narg(opt_title) ELSE title END,
  description = CASE WHEN CAST(sqlc.narg(opt_description) AS text) IS NOT NULL THEN sqlc.narg(opt_description) ELSE description END,
  updated_at = datetime('now')
WHERE
  sqlc.narg(id) = issues.id
;

-- name: DeleteIssueAsync :exec
DELETE FROM issues
WHERE
  ? = issues.id
;

-- name: NewAuthorAsync :exec
INSERT INTO authors (
  name,
  updated_at
) VALUES (
  ?,
  datetime('now')
);

-- name: NewBookAsync :exec
INSERT INTO books (
  title,
  author_id,
  updated_at
) VALUES (
  ?,
  ?,
  datetime('now')
);

-- name: AddLogAsync :exec
INSERT INTO logs (
  message,
  created_at
) VALUES (
  ?,
  datetime('now')
);
