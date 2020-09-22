CREATE TABLE todu_tasks (
  task_id INT NOT NULL AUTO_INCREMENT,
  list_id INT NOT NULL,
  date VARCHAR(10) NOT NULL,
  hour INT NOT NULL,
  minute INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(200),
  location VARCHAR(200),
  importance INT NOT NULL,
  daily INT NOT NULL,
  PRIMARY KEY ( task_id )
);

CREATE TABLE todu_lists (
  list_id INT NOT NULL AUTO_INCREMENT,
  list_title VARCHAR(200) NOT NULL,
  PRIMARY KEY ( list_id )
);
