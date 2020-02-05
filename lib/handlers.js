const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const { App } = require('./app');

const CONFIG_PATH = require('./config').DATA_STORE;
const STATIC_FOLDER = `${__dirname}`;
const DATA_STORE = CONFIG_PATH || `${STATIC_FOLDER}/../dataBase/todoList.json`;
const okStatusCode = 200;

const makeNewTodoData = function(body) {
  const id = new Date().getTime().toString();
  return {
    id: id,
    title: body.title,
    tasks: []
  };
};

const serveNewCard = function(req, res) {
  const fileContent = fs.readFileSync(DATA_STORE, 'utf8') || '[]';
  const todoContent = JSON.parse(fileContent);
  const newTodoData = makeNewTodoData(JSON.parse(req.body));

  todoContent.unshift(newTodoData);
  fs.writeFileSync(DATA_STORE, JSON.stringify(todoContent));
  res.end(JSON.stringify(newTodoData));
};

const isCorrectPath = absolutePath => {
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  return !stat || !stat.isFile();
};

const serveStaticFile = (req, res, next) => {
  const publicFolder = `${STATIC_FOLDER}/../public`;
  const path = req.url === '/' ? '/index.html' : req.url;
  const absolutePath = `${publicFolder}${path}`;
  if (isCorrectPath(absolutePath)) {
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

const serveAllTodo = (req, res) => {
  const content = fs.readFileSync(DATA_STORE);
  const extension = DATA_STORE.split('.').pop();

  res.writeHead(okStatusCode, {
    'Content-Length': content.length,
    'Content-Type': CONTENT_TYPES[extension]
  });
  res.end(content);
};

const serveDeleteTodo = (req, res) => {
  const id = req.body;
  const content = JSON.parse(fs.readFileSync(DATA_STORE));
  const targetCard = content.find(card => {
    return card.id === id;
  });
  const inxOfTargetCard = content.indexOf(targetCard);
  delete content[inxOfTargetCard];
  const remainingCards = content.filter(card => card);
  fs.writeFileSync(DATA_STORE, JSON.stringify(remainingCards));

  res.writeHead(okStatusCode);
  res.end();
};

const serveAddItem = (req, res) => {
  const { id, content } = JSON.parse(req.body);
  const cardId = id;
  const newItem = {
    id: new Date().getTime().toString(),
    content: content,
    isDone: false
  };
  const fileContent = JSON.parse(fs.readFileSync(DATA_STORE));

  const cardIndex = fileContent.findIndex(card => card.id === cardId);
  fileContent[cardIndex].tasks.push(newItem);
  fs.writeFileSync(DATA_STORE, JSON.stringify(fileContent));

  res.writeHead(okStatusCode);

  res.end(JSON.stringify(newItem));
};

const serveToggle = (req, res) => {
  const { cardId, taskId } = JSON.parse(req.body);

  const content = JSON.parse(fs.readFileSync(DATA_STORE));
  const card = content.find(card => card.id === cardId);

  const task = card.tasks.find(task => task.id === taskId);
  task.isDone = !task.isDone;

  fs.writeFileSync(DATA_STORE, JSON.stringify(content));

  res.writeHead(okStatusCode);
  res.end();
};

const serveDeleteTodoItem = (req, res) => {
  const { cardId, taskId } = JSON.parse(req.body);
  const content = JSON.parse(fs.readFileSync(DATA_STORE));
  const card = content.find(card => card.id === cardId);
  const indxOfItem = card.tasks.findIndex(task => task.id === taskId);

  delete card.tasks[indxOfItem];
  card.tasks = card.tasks.filter(task => task);

  fs.writeFileSync(DATA_STORE, JSON.stringify(content));

  res.writeHead(okStatusCode);
  res.end();
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

app.post('/newTodoCard', serveNewCard);
app.post('/removeTodoItem', serveDeleteTodoItem);
app.post('/toggleIsDoneStatus', serveToggle);
app.post('/addItem', serveAddItem);
app.post('/removeTodo', serveDeleteTodo);
app.post('', serveNotFound);

app.use('', methodNotAllowed);

module.exports = app;
