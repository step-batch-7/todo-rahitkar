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

const makeNewTodoData = function(body) {
  const id = new Date().getTime().toString();
  return {
    id: id,
    title: body.title,
    tasks: []
  };
};

const serveAllTodo = (req, res) => {
  res.writeHead(okStatusCode, {
    'Content-Type': CONTENT_TYPES.json
  });
  res.end(JSON.stringify(todoContent.todoCards));
};

const serveNewCard = function(req, res) {
  const newTodoData = makeNewTodoData(JSON.parse(req.body));

  const todoList = todoContent.addNewTodo(newTodoData);
  fs.writeFile(DATA_STORE, JSON.stringify(todoList), () => {});
  res.writeHead(okStatusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(newTodoData));
};

const serveDeleteTodo = (req, res) => {
  const cardId = req.body;
  todoContent.removeCard(cardId);
  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => {});

  res.writeHead(okStatusCode);
  res.end();
};

const serveAddItem = (req, res) => {
  const { id, content } = JSON.parse(req.body);
  const cardId = id;
  const taskId = new Date().getTime().toString();

  const card = todoContent.findCard(cardId);

  const newItem = card.addItem(taskId, content);
  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => {});

  res.writeHead(okStatusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(newItem));
};

const serveDeleteItem = (req, res) => {
  const { cardId, taskId } = JSON.parse(req.body);

  const card = todoContent.findCard(cardId);
  card.removeItem(taskId);

  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => {});

  res.writeHead(okStatusCode);
  res.end();
};

const serveToggle = (req, res) => {
  const { cardId, taskId } = JSON.parse(req.body);
  const card = todoContent.findCard(cardId);

  const task = card.findTask(taskId);

  task.toggleStatus();

  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => {});

  res.writeHead(okStatusCode, { 'Content-Type': 'application/json' });
  res.end();
};

const editTitle = (req, res) => {
  const { cardId, title } = JSON.parse(req.body);

  const card = todoContent.findCard(cardId);

  card.editTitle(title);

  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => {});

  res.writeHead(okStatusCode);
  res.end();
};

const editTaskContent = (req, res) => {
  const { cardId, taskId, content } = JSON.parse(req.body);
  const card = todoContent.findCard(cardId);

  const task = card.tasks.find(task => task.id === taskId);

  task.editContent(content);
  fs.writeFile(DATA_STORE, JSON.stringify(todoContent.todoCards), () => {});

  res.writeHead(okStatusCode);
  res.end();
};

const serveStaticFile = (req, res, next) => {
  const publicFolder = `${STATIC_FOLDER}/../public`;
  const path = req.url === '/' ? '/index.html' : req.url;
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

const serveNotFound = function(req, res) {
  const notFoundStatusCode = 404;
  res.writeHead(notFoundStatusCode);
  res.end('Not Found');
};

const methodNotAllowed = function(req, res) {
  const methodNotAllowedStatusCode = 400;
  res.writeHead(methodNotAllowedStatusCode);
  res.end('method not allowed');
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    req.body = data;
    next();
  });
};

const app = new App();

app.use(readBody);

app.get('/allTodo', serveAllTodo);
app.get('', serveStaticFile);
app.get('', serveNotFound);

app.post('/editTaskContent', editTaskContent);
app.post('/editTitle', editTitle);
app.post('/newTodoCard', serveNewCard);
app.post('/removeTodoItem', serveDeleteItem);
app.post('/toggleHasDoneStatus', serveToggle);
app.post('/addItem', serveAddItem);
app.post('/removeTodo', serveDeleteTodo);
app.post('', serveNotFound);

app.use(methodNotAllowed);

module.exports = app;
