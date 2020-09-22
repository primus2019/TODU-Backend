var express = require('express');
var pool = require('./connection');
var router = express.Router();

/* GET home page. */
router.get('/todu/review_tasklists', function(req, res, next) {
  var tasks = [];
  var lists = [];
  pool.query(`
    SELECT c.*, e.minId, e.maxId
      FROM (SELECT
              a.*, b.list_title
            FROM
              todu_tasks a
            LEFT JOIN
              todu_lists b
            ON
              a.list_id = b.list_id
            ) c,
          (SELECT
            MIN(d.list_id) as minId, MAX(d.list_id) as maxId
          FROM
            todu_lists d
          ) e`
  )
  .then(([result, fields]) => {
    if (result.length === 0) {
      res.send({})
      return
    }
    const minId = result[0].minId;
    const maxId = result[0].maxId;
    var response = {};
    for (var i = minId; i <= maxId; i++) {
      response[i] = { list_id: i, tasks: [] }
    }
    for (var i = 0; i < result.length; i++) {
      response[result[i].list_id].list_title = result[i].list_title
      response[result[i].list_id].tasks.push(result[i])
    }
    for (var i = minId; i <= maxId; i++) {
      if (response[i].tasks.length === 0) {
        delete response[i];
      }
    }
    res.send(response);
  })
  .catch((err) => {
    console.log(err);
  })
});

// POST: /todu/add_list
router.post('/todu/add_list', async function(req, res, next) {
  const listTitle = req.body['title']
  pool.query(`
    INSERT INTO todu_lists (list_title)
    VALUES ("${ listTitle }");`
  )
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 });
  })
  .then(() => {
    pool.query(`
    INSERT INTO todu_tasks (
      list_id, date, hour, minute, title, importance, daily
    )
    SELECT
      MAX(list_id), "20200101", 0, 0, "new task", 0, 0
    FROM
      todu_lists;`
    )
    .catch((err) => {
      console.log(err);
      res.send({ status: 1 });
    })
    .then(() => {
      res.send({ status: 0 });
    });
  });
});

// POST: /todu/delete_list
router.post('/todu/delete_list', async function(req, res, next) {
  const listIndex = req.body['listIndex']
  pool.query(`
    DELETE FROM todu_lists
    WHERE list_id = ${ listIndex };`
  )
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 });
  })
  .then(() => {
    pool.query(`
      DELETE FROM todu_tasks
      WHERE list_id = ${ listIndex };`
    )
    .catch((err) => {
      console.log(err);
      res.send({ status: 1 });
    })
    .then(() => {
      res.send({ status: 0 });
    });
  });
});

// POST: /todu/add_task
router.post('/todu/add_task', async function(req, res, next) {
  const listId = req.body['listId']
  const task = req.body['task']
  pool.query(`
    DELETE FROM
      todu_tasks
    WHERE
      title = "new task"
    AND
      list_id = ${ listId };
  `)
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 })
  });
  pool.query(`
    INSERT INTO todu_tasks (
      list_id, date, hour, minute, title, description, location, importance, daily
    )
    VALUES (
      ${ listId },
      "${ task.date }",
      ${ task.hour },
      ${ task.minute },
      "${ task.title }",
      "${ task.description }",
      "${ task.location }",
      ${ task.importance },
      ${ task.daily }
    )
  `)
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 });
  })
  .then(() => {
    res.send({ status: 0 });
  });
});

// POST: /todu/alter_title
router.post('/todu/alter_title', async function(req, res, next) {
  const listId = req.body['listId']
  const title = req.body['title']
  pool.query(`
    UPDATE
      todu_lists
    SET
      list_title = "${ title }"
    WHERE
      list_id = ${ listId };
  `)
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 });
  })
  .then(() => {
    res.send({ status: 0 });
  });
});

// POST: /todu/delete_task
router.post('/todu/delete_task', async function(req, res, next) {
  const taskId = req.body['taskId']
  pool.query(`
    DELETE FROM
      todu_tasks
    WHERE
      task_id = ${ taskId };
  `)
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 })
  })
  .then(() => {
    res.send({ status: 0 });
  });
});

// POST: /todu/alter_task
router.post('/todu/alter_task', async function(req, res, next) {
  const taskId = req.body['taskId']
  const task = req.body['task']
  console.log(`
    UPDATE
      todu_tasks
    SET
      date = "${ task.date }",
      hour = ${ task.hour },
      minute = ${ task.minute },
      title = "${ task.title }",
      description = "${ task.description }",
      location = "${ task.location }",
      importance = ${ task.importance },
      daily = ${ task.daily }
    WHERE
      task_id = ${ taskId };
  `)
  pool.query(`
    UPDATE
      todu_tasks
    SET
      date = "${ task.date }",
      hour = ${ task.hour },
      minute = ${ task.minute },
      title = "${ task.title }",
      description = "${ task.description }",
      location = "${ task.location }",
      importance = ${ task.importance },
      daily = ${ task.daily }
    WHERE
      task_id = ${ taskId };
  `)
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 })
  })
  .then(() => {
    res.send({ status: 0 });
  });
});

// POST: /todu/move_tasks
router.post('/todu/move_tasks', async function(req, res, next) {
  const taskId = req.body['taskId']
  const listId = req.body['listId']
  pool.query(`
    UPDATE
      todu_tasks
    SET
      list_id = ${ listId }
    WHERE
      task_id = ${ taskId };
  `)
  .catch((err) => {
    console.log(err);
    res.send({ status: 1 })
  })
  .then(() => {
    res.send({ status: 0 });
  });
});



module.exports = router;
