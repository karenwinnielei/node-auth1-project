const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const Users = require('../users/usersModel');

router.post('/register', (req, res) => {
  let creds = req.body;
  const rounds = process.env.HASH_ROUNDS || 4;

  const hash = bcryptjs.hashSync(creds.password, rounds);

  creds.password = hash;

  Users.add(creds)
    .then((saved) => {
      res.status(201).json({ data: saved });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then((users) => {
      const user = users[0];

      if (user && bcryptjs.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = user.username;

        res
          .status(200)
          .json({ message: 'logged in', session: req.session });
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          message: 'error logging out. please try later.',
        });
      } else {
        res.status(204).end();
      }
    });

    res.status(204).end();
  } else {
    res.status(200).json({ message: 'already logged out' });
  }
});

module.exports = router;
