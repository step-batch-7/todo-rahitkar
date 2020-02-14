const express = require('express');
const handlers = require('./handlers')
const cookieParser = require('cookie-parser');

const app = express();

const hasFields = (...fields) => {
  return (req, res, next) => {
    const keys = Object.keys(req.body);
    if (fields.every(field => keys.includes(field))) {
      return next();
    }
    res.statusCode = 404;
    res.end();
  };
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get(/\/$/, handlers.serveEntryPage);
app.get('/index.html', handlers.serveEntryPage);
app.get('/home.html', handlers.serveHomePage);
app.use(express.static('public'));
app.get('/allTodo', handlers.serveAllTodo);

app.post(
  '/editTaskContent',
  hasFields('cardId', 'taskId', 'content'),
  handlers.editTaskContent
);
app.post('/login', hasFields('username', 'password'), handlers.login);
app.post('/editTitle', hasFields('cardId', 'title'), handlers.editTitle);
app.post('/newTodoCard', hasFields('title'), handlers.serveNewCard);
app.post('/removeTodoItem', hasFields('cardId', 'taskId'), handlers.serveDeleteItem);
app.post('/toggleHasDoneStatus', hasFields('cardId', 'taskId'), handlers.serveToggle);
app.post('/addItem', hasFields('id', 'content'), handlers.serveAddItem);
app.post('/removeTodo', hasFields('cardId'), handlers.serveDeleteTodo);

module.exports = { app };