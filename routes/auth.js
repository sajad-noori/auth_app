const express = require('express');
const crypto = require('crypto');
const { promisify } = require('util');

const router = express.Router();

const db = require('../db');

const query = promisify(db.query).bind(db);

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const user = await query('SELECT * FROM users WHERE username = ? AND password = ?', [
    username,
    hashedPassword,
  ]);

  if (user.length > 0) {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Incorrect username or password');
  }
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

// routes/auth.js

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const existingUser = await query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      // User with the same username already exists
      return res.render('signup', { error: 'Username already taken. Choose a different username.', username });
    }

    await query('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);
    res.redirect('/');
  } catch (error) {
    console.error('Error creating user:', error);
    res.render('signup', { error: 'Error creating user. Please try again.', username });
  }
});




router.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.render('dashboard', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
