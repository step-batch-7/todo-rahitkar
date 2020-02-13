const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const { App } = require('./app');
const { TodoCards } = require('./todo');

const CONFIG_PATH = require('./config').DATA_STORE;
const STATIC_FOLDER = `${__dirname}`;
const DATA_STORE = CONFIG_PATH || `${STATIC_FOLDER}/../dataBase/todoList.json`;
const okStatusCode = 200;
let content = '[]';

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

const serveNewCard = function (req, res) {
  const { title } = req.body;
  const id = incrementId();
  todoContent.addNewTodo({ title, id });
  const todoCard = todoContent.getCard(+id);
  saveTodoList();
  sendResponse(todoCard, res);
};

const serveDeleteTodo = (req, res) => {
  const { cardId } = req.body;
  todoContent.removeCard(+cardId);
  saveTodoList();
  sendResponse({}, res);
};

const serveAddItem = (req, res) => {
  const { id, content } = req.body;
  const cardId = +id;
  const taskId = incrementId();
  const card = todoContent.getCard(cardId);
  card.addItem(taskId, content);
  const item = card.getTask(taskId);
  saveTodoList();
  sendResponse(item, res);
};

const serveDeleteItem = (req, res) => {
  const { cardId, taskId } = req.body;

  const card = todoContent.getCard(+cardId);
  card.removeItem(+taskId);

  saveTodoList();
  sendResponse({}, res);
};

const serveToggle = (req, res) => {
  const { cardId, taskId } = req.body;
  const card = todoContent.getCard(+cardId);

  const task = card.getTask(+taskId);
  task.toggleStatus();

  saveTodoList();
  sendResponse({}, res);
};

const editTitle = (req, res) => {
  const { cardId, title } = req.body;

  const card = todoContent.getCard(+cardId);

  card.editTitle(title);

  saveTodoList();
  sendResponse({}, res);
};

const editTaskContent = (req, res) => {
  const { cardId, taskId, content } = req.body;
  const card = todoContent.getCard(+cardId);

  const task = card.getTask(+taskId);

  task.editContent(content);
  saveTodoList();
  sendResponse({}, res);
};

const login = (req, res) => {
  const { userName, password } = req.body;
  if (userName === 'step7' && password === '192837465') {
    res.writeHead(200);
    res.end();
    return;
  }
};

const serveEntryPage = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie) {
    return next();
  }
  res.setHeader('Location', '/index.html')
  res.writeHead(301);
  res.end();
};

const serveHomePage = (req, res, next) => {
  const { cookie } = req.headers;
  if (cookie) {
    return next();
  }
  res.setHeader('Location', '/entryPage.html')
  res.writeHead(301);
  res.end();
};

const serveStaticFile = (req, res, next) => {
  const publicFolder = `${STATIC_FOLDER}/../public`;
  const path = req.url === '/' ? '/entryPage.html' : req.url;
  const absolutePath = `${publicFolder}${path}`;
  if (doesFileNotPresent(absolutePath)) {
    return next();
  }
  const content = fs.readFileSync(absolutePath);

  const extension = absolutePath.split('.').pop();

  res.writeHead(okStatusCode, {
    'Content-Length': content.length,
    'Content-Type': CONTENT_TYPES[extension]
  });
  res.end(content);
};

const serveNotFound = function (req, res) {
  const notFoundStatusCode = 404;
  res.writeHead(notFoundStatusCode);
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  const methodNotAllowedStatusCode = 400;
  res.writeHead(methodNotAllowedStatusCode);
  res.end('method not allowed');
};

const readBody = function (req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    if (data) {
      req.body = JSON.parse(data);
    }
    next();
  });
};

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

const app = new App();

app.use(readBody);

app.get(/\/$/, serveEntryPage);
app.get('/index.html', serveHomePage);
app.get('/entryPage.html', serveEntryPage);
app.get('/allTodo', serveAllTodo);
app.get('', serveStaticFile);
app.get('', serveNotFound);

app.post(
  '/editTaskContent',
  hasFields('cardId', 'taskId', 'content'),
  editTaskContent
);
app.post('/login', hasFields('userName', 'password'), login);
app.post('/editTitle', hasFields('cardId', 'title'), editTitle);
app.post('/newTodoCard', hasFields('title'), serveNewCard);
app.post('/removeTodoItem', hasFields('cardId', 'taskId'), serveDeleteItem);
app.post('/toggleHasDoneStatus', hasFields('cardId', 'taskId'), serveToggle);
app.post('/addItem', hasFields('id', 'content'), serveAddItem);
app.post('/removeTodo', hasFields('cardId'), serveDeleteTodo);
app.post('', serveNotFound);

app.use(methodNotAllowed);

module.exports = app;
