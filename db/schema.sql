CREATE TABLE schema_features (
  -- Sort in dictionary order
  initial int,
  --
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE issues (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  description text NOT NULL,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors (
  id integer PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  author_id integer NOT NULL REFERENCES authors(id),
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);
