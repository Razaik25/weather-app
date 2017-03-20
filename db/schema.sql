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
  location_id INTEGER,
  unix_timestamp INTEGER,
  users_id INTEGER REFERENCES users
);


--Note this is not the most efficient schema. A better way would be create a junction table since users and locations have many to many
--relationship i.e a user can have multiple locations and a same location can be saved by multiple users.
--The table will have two foreign keys referencing to user id and location id, which will create a one to many relationship for junction table with users and locations table
