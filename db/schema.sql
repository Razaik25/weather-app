DROP TABLE if exists users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY UNIQUE,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255),
  password_digest TEXT
);
