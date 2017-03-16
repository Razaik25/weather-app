DROP TABLE if exists users CASCADE;
DROP TABLE if exists users_locations CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY UNIQUE,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_digest TEXT
);

CREATE TABLE users_locations (
  id SERIAL PRIMARY KEY UNIQUE,
  name TEXT,
  country TEXT,
  weather_desc VARCHAR(255),
  icon TEXT,
  temp TEXT,
  temp_max TEXT,
  temp_min TEXT,
  wind TEXT,
  humidity TEXT,
  clouds TEXT,
  pressure TEXT,
  users_id INTEGER REFERENCES users
);
