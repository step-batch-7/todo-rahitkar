const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const { TodoCards } = require('./todo');
const { loadTemplate } = require('./viewTemplate');

const CONFIG_PATH = require('./config').DATA_STORE;
const DATA_STORE = CONFIG_PATH;
const okStatusCode = 200;
let content = '[]';
const errors = { invalidUserDetails: '' };

const doesFileNotPresent = absolutePath => {
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  return !stat || !stat.isFile();
};

if (!doesFileNotPresent(DATA_STORE)) {
  content = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
}
const todoContent = TodoCards.load(JSON.parse(content));

const getId = () => {
  let id = new Date().getTime();
  return () => ++id;
};

const incrementId = getId();

const saveTodoList = () => {
  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => { });
};

const sendResponse = (data, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.writeHead(okStatusCode);
  res.end(JSON.stringify(data));
};

const serveAllTodo = (req, res) => {
  sendResponse(todoContent.todoCards, res);
};

const addNewCard = function (req, res) {
  const { title } = req.body;
  const id = incrementId();
  todoContent.addNewTodo({ title, id });
  const todoCard = todoContent.getCard(+id);
  saveTodoList();
  sendResponse(todoCard, res);
};

const deleteTodo = (req, res) => {
  const { cardId } = req.body;
  todoContent.removeCard(+cardId);
  saveTodoList();
  sendResponse({}, res);
};

const addItem = (req, res) => {
  const { id, content } = req.body;
  const cardId = +id;
  const taskId = incrementId();
  todoContent.addItem(cardId, taskId, content);
  const item = todoContent.getTask(cardId, taskId);
  saveTodoList();
  sendResponse(item, res);
};

const deleteItem = (req, res) => {
  const { cardId, taskId } = req.body;
  todoContent.removeItem(+cardId, +taskId);
  saveTodoList();
  sendResponse({}, res);
};

const toggleTaskStatus = (req, res) => {
  const { cardId, taskId } = req.body;
  todoContent.toggleStatus(+cardId, +taskId);
  saveTodoList();
  sendResponse({}, res);
};

const editTitle = (req, res) => {
  const { cardId, title } = req.body;
  todoContent.editTitle(+cardId, title);
  saveTodoList();
  sendResponse({}, res);
};

const editTaskContent = (req, res) => {
  const { cardId, taskId, content } = req.body;
  todoContent.editTaskContent(+cardId, +taskId, content);
  saveTodoList();
  sendResponse({}, res);
};

const login = (req, res) => {
  const { username, password } = req.body;
  if (username === 'step7' && password === '192837465') {
    res.setHeader('Location', '/home.html');
    res.setHeader('Set-Cookie', 'session-id=1');
    res.writeHead(302);
    res.end();
    return;
  }
  errors.invalidUserDetails = 'invalid credentials';
  res.setHeader('location', '/index.html');
  res.writeHead(302);
  res.end();
};

const serveTemplate = (req, res, next) => {
  if (req.url !== '/index.html' && req.url !== '/') {
    return next();
  }
  const html = loadTemplate('/index.html', errors);
  errors.invalidUserDetails = '';
  res.writeHead(200);
  res.end(html);
}

const serveEntryPage = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie) {
    return next();
  }
  res.setHeader('Location', '/home.html')
  res.writeHead(302);
  res.end();
};

const serveHomePage = (req, res, next) => {
  const { cookie } = req.headers;
  if (cookie) {
    return next();
  }
  res.setHeader('Location', '/index.html')
  res.writeHead(302);
  res.end();
};

module.exports = {
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
};
