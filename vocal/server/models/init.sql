-- Author: Chris Buonocore
-- Vocal Coin SQL schema setup code

-- TODO: Figure out migration strategy, rather than drop,  qif these schemas need to evolve once deployed (they almost certainly will).
-- DROP DATABASE IF EXISTS vocal;
CREATE DATABASE vocal;

\c vocal;
-- A votable topic that can be voted on via an entry in the table below
CREATE TABLE issues (
  ID SERIAL PRIMARY KEY,
  user_id SERIAL,
  user_email VARCHAR,
  description VARCHAR,
  title VARCHAR,
  time BIGINT
);

-- Represents a user vote marker and message stored on the map
CREATE TABLE votes (
  ID SERIAL PRIMARY KEY,
  issue_id SERIAL REFERENCES issues(ID),
  user_id SERIAL,
  user_email VARCHAR,
  lat float(7),
  lng float(7),
  time BIGINT,
  message VARCHAR,
  agree BOOLEAN NOT NULL
);

/* For socket io */
CREATE TABLE events (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  time BIGINT
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  username VARCHAR
);