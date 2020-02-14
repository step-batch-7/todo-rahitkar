const express = require('express');
const cookieParser = require('cookie-parser');
const {
  serveHomePage,
  serveEntryPage,
  serveTemplate,
  serveAllTodo,
  deleteTodo,
  addItem,
  addNewCard,
  login,
  editTaskContent,
  editTitle,
  toggleTaskStatus,
  deleteItem
} = require('./handlers')

const app = express();

const hasFields = (...fields) => {
  return (req, res, next) => {
    const keys = Object.keys(req.body);
    if (fields.every(field => keys.includes(field))) {
      return next();
    }
    res.statusCode = 400;
    res.end();
  };
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get(/\/$/, serveEntryPage);
app.get('/index.html', serveEntryPage);
app.get('/home.html', serveHomePage);
app.use(express.static('public'));
app.use(serveTemplate);
app.get('/allTodo', serveAllTodo);

app.post(
  '/editTaskContent',
  hasFields('cardId', 'taskId', 'content'),
  editTaskContent
);
app.post('/login', hasFields('username', 'password'), login);
app.post('/editTitle', hasFields('cardId', 'title'), editTitle);
app.post('/newTodoCard', hasFields('title'), addNewCard);
app.post('/removeTodoItem', hasFields('cardId', 'taskId'), deleteItem);
app.post('/toggleHasDoneStatus', hasFields('cardId', 'taskId'), toggleTaskStatus);
app.post('/addItem', hasFields('id', 'content'), addItem);
app.post('/removeTodo', hasFields('cardId'), deleteTodo);

module.exports = { app };