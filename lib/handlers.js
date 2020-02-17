const fs = require('fs');
const CONTENT_TYPES = require('./mimeType');
const { loadTemplate } = require('./viewTemplate');

const okStatusCode = 200;
const errors = { invalidUserDetails: '', invalidEmail: '', invalidUserName: '' };

const getId = () => {
  let id = new Date().getTime();
  return () => ++id;
};

const incrementId = getId();

const saveTodoList = (req) => {
  const { users, DATA_STORE } = req.app.locals;
  fs.writeFile(DATA_STORE, users.toJson(), () => { });
};

const sendResponse = (data, res) => {
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.writeHead(okStatusCode);
  res.end(JSON.stringify(data));
};

const getTodoContent = (req) => {
  const { users } = req.app.locals;
  const { username } = req.session;
  return users.getTodoCards(username);
}

const serveAllTodo = (req, res) => {
  const todoContent = getTodoContent(req);

  if (!todoContent) {
    res.clearCookie('SID');
    redirectTo(res, '/index.html');
    return;
  }
  sendResponse(todoContent.todoCards, res);
};

const addNewCard = function (req, res) {
  const { title } = req.body;
  const id = incrementId();
  const todoContent = getTodoContent(req);
  todoContent.addNewTodo({ title, id });
  const todoCard = todoContent.getCard(+id);
  saveTodoList(req);
  sendResponse(todoCard, res);
};

const deleteTodo = (req, res) => {
  const { cardId } = req.body;
  const todoContent = getTodoContent(req);
  todoContent.removeCard(+cardId);
  saveTodoList(req);
  sendResponse({}, res);
};

const addItem = (req, res) => {
  const { id, content } = req.body;
  const todoContent = getTodoContent(req);
  const cardId = +id;
  const taskId = incrementId();
  todoContent.addItem(cardId, taskId, content);
  const item = todoContent.getTask(cardId, taskId);
  saveTodoList(req);
  sendResponse(item, res);
};

const deleteItem = (req, res) => {
  const { cardId, taskId } = req.body;
  const todoContent = getTodoContent(req);
  todoContent.removeItem(+cardId, +taskId);
  saveTodoList(req);
  sendResponse({}, res);
};

const toggleTaskStatus = (req, res) => {
  const { cardId, taskId } = req.body;
  const todoContent = getTodoContent(req);
  todoContent.toggleStatus(+cardId, +taskId);
  saveTodoList(req);
  sendResponse({}, res);
};

const editTitle = (req, res) => {
  const { cardId, title } = req.body;
  const todoContent = getTodoContent(req);
  todoContent.editTitle(+cardId, title);
  saveTodoList(req);
  sendResponse({}, res);
};

const editTaskContent = (req, res) => {
  const { cardId, taskId, content } = req.body;
  const todoContent = getTodoContent(req);
  todoContent.editTaskContent(+cardId, +taskId, content);
  saveTodoList(req);
  sendResponse({}, res);
};

const isValid = (userDetails) => {
  const { username, email } = userDetails;
  if (!email.match(/[ge]mail\.com/)) {
    errors.invalidEmail = 'Email is not valid'
    return false;
  }
  if (users.isUserExists(username)) {
    errors.invalidUserName = 'User already exists';
    return false;
  }
  return true;
}

const redirectTo = (res, location) => {
  res.setHeader('location', location);
  res.writeHead(302);
  res.end();
};

const signUp = (req, res) => {
  const userDetails = req.body;
  errors.invalidUserDetails = '';
  if (isValid(userDetails)) {
    const { username, email, password } = userDetails;
    users.addUser({ username, email, password });
    saveTodoList(req);
    redirectTo(res, '/index.html');
    return;
  }
  redirectTo(res, '/signup.html');
};

const login = (req, res) => {
  const { username, password } = req.body;
  const { users } = req.app.locals;
  if (users.isValidCredentials(username, password)) {
    const sessionId = incrementId();
    req.app.locals.sessions.push({ SID: sessionId, username });
    res.setHeader('Set-Cookie', `SID=${sessionId}`);
    redirectTo(res, '/home.html');
    return;
  }
  errors.invalidUserDetails = 'Invalid user details';
  redirectTo(res, '/index.html')
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
  resetErrors();
  res.writeHead(200);
  res.end(html);
}

const serveEntryPage = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie) {
    return next();
  }
  redirectTo(res, '/home.html')
};

const serveHomePage = (req, res, next) => {
  const { cookie } = req.headers;
  if (cookie) {
    return next();
  }
  redirectTo(res, '/index.html');
};

const loadSession = (req, res, next) => {
  const { cookies } = req;
  const urls = ['/login', '/signup'];
  const session = req.app.locals.sessions.find(session =>
    session.SID === +cookies.SID);
  if (session || urls.includes(req.url)) {
    req.session = session;
    return next();
  }
  res.clearCookie('SID');
  redirectTo(res, '/index.html');
}

module.exports = {
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
  deleteItem
};
