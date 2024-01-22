const express = require('express');
const session = require('express-session');
const path = require('path');
const { promisify } = require('util');

const app = express();
const port = 3000;

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use('/', require('./routes/auth'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
