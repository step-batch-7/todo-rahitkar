const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const { TodoCards } = require('./todo');
const { loadTemplate } = require('./viewTemplate');

const CONFIG_PATH = require('./config').DATA_STORE;
const DATA_STORE = CONFIG_PATH;
const okStatusCode = 200;
let content = '[]';
const errors = { invalidUserDetails: '', invalidEmail: '', invalidUserName: '' };

const doesFileNotPresent = absolutePath => {
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  return !stat || !stat.isFile();
};

if (!doesFileNotPresent(DATA_STORE)) {
  content = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
}
const todoContent = TodoCards.load(JSON.parse(content));

const users = {
  rahith: { userDetails: { password: 12345, email: 'rahith@email.com' }, todoContent },
  sai: { userDetails: { password: 67890, email: 'sai@gmail.com' }, todoContent }
}

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

const isValid = (userDetails) => {
  const { username, email } = userDetails;
  if (!email.match(/[ge]mail\.com/)) {
    errors.invalidEmail = 'Email is not valid'
    return false;
  }
  if (username in users) {
    errors.invalidUserName = 'User already exists';
    return false;
  }
  return true;
}

const signUp = (req, res) => {
  const userDetails = req.body;
  errors.invalidUserDetails = '';
  if (isValid(userDetails)) {
    res.setHeader('location', '/index.html');
    res.writeHead(302);
    res.end();
  }
  res.setHeader('location', '/signup.html');
  res.writeHead(302);
  res.end();
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
  errors.invalidUserDetails = 'Invalid user details';
  res.setHeader('location', '/index.html');
  res.writeHead(302);
  res.end();
};

const resetErrors = () => {
  errors.invalidUserDetails = '';
  errors.invalidEmail = '';
  errors.invalidUserName = ''
}

const serveTemplate = (req, res, next) => {
  const validTemplates = ['/index.html', '/', '/signup.html']
  if (!validTemplates.includes(req.url)) {
    return next();
  }
  const path = req.url === '/' ? '/index.html' : req.url;
  const html = loadTemplate(path, errors);
  console.log(path)
  resetErrors();
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
  signUp,
  editTaskContent,
  editTitle,
  toggleTaskStatus,
  deleteItem
};
