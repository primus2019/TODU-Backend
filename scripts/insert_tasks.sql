INSERT INTO todu_tasks (
  list_id,
  date,
  hour,
  minute,
  title,
  description,
  location,
  importance,
  daily
)
VALUES
  (2, '20200918',8,10,'mocking title 0','some descripts', 'locaion demo', 0,0),
  (1, '20200918',8,10,'mocking title 1','some descripts', 'locaion demo', 0,0),
  (2, '20200918',8,10,'mocking title','some descripts', 'locaion demo', 0,0),
  (1, '20200918',8,10,'mocking title','some descripts', 'locaion demo', 0,0),
  (1, '20200918',8,10,'mocking title','some descripts', 'locaion demo', 0,0),
  (1, '20200918',8,10,'mocking title','some descripts', 'locaion demo', 0,0)
;

INSERT INTO todu_lists (
  list_title
)
VALUES
  ('mocking list title 0'),
  ('mocking list title 1')
;
