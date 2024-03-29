CREATE TABLE user_account (
  id SERIAL PRIMARY KEY,
  username text,
  email text,
  hash_password text,
  birth_date date,
  registration_date date,
  activated bool,
  activation_code text
);

CREATE TABLE story (
  id SERIAL PRIMARY KEY,
  author_id int,
  starting_scene_id int,
  title text,
  description text,
  published bool
);

CREATE TABLE story_variable (
  id SERIAL PRIMARY KEY,
  story_id int,
  name varchar,
  type varchar,
  default_value varchar,
  note text
);

CREATE TABLE story_instance (
  id SERIAL PRIMARY KEY,
  story_id int,
  user_id int,
  current_scene_id int
);

CREATE TABLE story_instance_variable (
  id SERIAL PRIMARY KEY,
  story_instance_id int,
  story_variable_id int,
  value varchar
);

CREATE TABLE scene (
  id SERIAL PRIMARY KEY,
  story_id int,
  content text,
  template bool,
  note text,
  action text
);

CREATE TABLE choice (
  id SERIAL PRIMARY KEY,
  parent_scene_id int,
  next_scene_id int,
  content text,
  template bool,
  note text,
  action text
);

CREATE TABLE story_review (
  id SERIAL PRIMARY KEY,
  story_id int,
  user_id int,
  score int,
  review text
);

ALTER TABLE story ADD FOREIGN KEY (author_id) REFERENCES user_account (id);

ALTER TABLE story ADD FOREIGN KEY (starting_scene_id) REFERENCES scene (id);

ALTER TABLE story_variable ADD FOREIGN KEY (story_id) REFERENCES story (id);

ALTER TABLE story_instance ADD FOREIGN KEY (story_id) REFERENCES story (id);

ALTER TABLE story_instance ADD FOREIGN KEY (user_id) REFERENCES user_account (id);

ALTER TABLE story_instance ADD FOREIGN KEY (current_scene_id) REFERENCES scene (id);

ALTER TABLE story_instance_variable ADD FOREIGN KEY (story_instance_id) REFERENCES story_instance (id);

ALTER TABLE story_instance_variable ADD FOREIGN KEY (story_variable_id) REFERENCES story_variable (id);

ALTER TABLE scene ADD FOREIGN KEY (story_id) REFERENCES story (id);

ALTER TABLE choice ADD FOREIGN KEY (parent_scene_id) REFERENCES scene (id);

ALTER TABLE choice ADD FOREIGN KEY (next_scene_id) REFERENCES scene (id);

ALTER TABLE story_review ADD FOREIGN KEY (story_id) REFERENCES story (id);

ALTER TABLE story_review ADD FOREIGN KEY (user_id) REFERENCES user_account (id);
