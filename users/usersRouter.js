const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const Users = require('./usersModel');

router.get('/', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
