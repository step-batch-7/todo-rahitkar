const express = require('express');
const cookieParser = require('cookie-parser');
const { Users } = require('./users');
const CONFIG_PATH = require('./config').DATA_STORE;
const { loadUserData } = require('./fileSystem');
const {
  serveHomePage,
  serveEntryPage,
  serveTemplate,
  serveAllTodo,
  deleteTodo,
  loadSession,
  addItem,
  addNewCard,
  login,
  signUp,
  editTaskContent,
  editTitle,
  toggleTaskStatus,
  deleteItem,
  logOut
} = require('./handlers')

const app = express();

const DATA_STORE = CONFIG_PATH;
const usersData = JSON.parse(loadUserData(DATA_STORE));
const users = Users.load(usersData);

app.locals.users = users;
app.locals.sessions = [];
app.locals.DATA_STORE = DATA_STORE;

const hasFields = (fieldsText) => {
  const fields = fieldsText.split(',');
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
app.use(loadSession);
app.get('/logout', logOut);
app.get('/allTodo', serveAllTodo);

app.post(
  '/editTaskContent',
  hasFields('cardId,taskId,content'),
  editTaskContent
);

app.post('/signUp', hasFields('username,email,password'), signUp);
app.post('/login', hasFields('username,password'), login);
app.post('/editTitle', hasFields('cardId,title'), editTitle);
app.post('/newTodoCard', hasFields('title'), addNewCard);
app.post('/removeTodoItem', hasFields('cardId,taskId'), deleteItem);
app.post('/toggleHasDoneStatus', hasFields('cardId,taskId'), toggleTaskStatus);
app.post('/addItem', hasFields('id,content'), addItem);
app.post('/removeTodo', hasFields('cardId'), deleteTodo);

module.exports = { app };