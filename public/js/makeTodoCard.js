const toHtml = function(title, items) {
  const html =
    `<div class="todoHeader"><h4 style="color: rgba(0,0,0,0.7);">${title}</h4></div><div onclick= removeTodo()  style="color: red;">x</div>` +
    '<div style="justify-content:flex-start; margin-top:10px;">' +
    items
      .map(item => {
        return (
          `<div class="todoItem" id="${item.id}">` +
          makeItemHtml(item.id, item.content, item.isDone) +
          '</div><br></br>'
        );
      })
      .join('') +
    `<input id="textArea" type="text" class="textArea" name="comments"/><button class="button"onclick="addTodoItem()">+</button></div>`;

  return html;
};

const makeCardHtml = title => {
  const cardHtml = `<div class="todoHeader"><h4 style="color: rgba(0,0,0,0.7);">${title}</h4></div>
  <div onclick="removeTodo()">x</div>
  <div>
  <input id="textArea" type="text" class="textArea" name="comments" />
  <button class="button" onclick="addTodoItem()">+</button></div>
  `;
  return cardHtml;
};

const makeItemHtml = (id, content, isDone) => {
  if (isDone) {
    return `
      <input type="checkbox" onclick="toggleStatus()" id="${id +
        Math.random()}" checked/><label for="${id}">${content}<span onclick="deleteItem()" style="color: red;">  X</span></label><br />
   `;
  }
  return `
  <input type="checkbox" onclick="toggleStatus()" id="${id +
    Math.random()}"/><label for="${id}">${content}<span onclick="deleteItem()" style="color: red;">  X</span></label><br />
`;
};

const deleteItem = () => {
  const taskId = event.target.parentElement.parentElement.id;
  const cardId =
    event.target.parentElement.parentElement.parentElement.parentElement.id;

  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      const itemToDelete = document.getElementById(taskId);
      itemToDelete.parentNode.removeChild(itemToDelete);
    }
  };
  req.open('POST', '/removeTodoItem');
  req.send(JSON.stringify({ cardId, taskId }));
};

const makeTodoCard = () => {
  const title = document.querySelector('#title').value;

  document.querySelector('#title').value = '';

  const newTodoData = {
    title: title
  };

  const req = new XMLHttpRequest();

  req.onload = function() {
    const todoList = document.querySelector('#todoList');
    const newTodo = document.createElement('div');
    newTodo.className = 'card';
    const resText = JSON.parse(this.responseText);

    newTodo.setAttribute('id', resText.id);
    newTodo.innerHTML = makeCardHtml(resText.title);

    todoList.prepend(newTodo);
  };
  req.open('POST', '/newTodoCard');
  req.send(JSON.stringify(newTodoData));
};

const addTodoItem = () => {
  const parentId = event.target.parentElement.parentElement.id;

  const allTextAreas = Array.from(document.querySelectorAll('#textArea'));
  const texts = allTextAreas.map(text => text.value);
  const [text] = texts.filter(text => text);

  for (let index = 0; index < allTextAreas.length; index++) {
    allTextAreas[index].value = '';
  }

  const req = new XMLHttpRequest();
  req.onload = function() {
    const card = document.getElementById(parentId);
    const resText = JSON.parse(this.responseText);
    const item = document.createElement('div');
    item.className = 'todoItem';
    item.innerHTML = makeItemHtml(resText.id, resText.content, resText.isDone);
    card.appendChild(item);
  };

  req.open('POST', '/addItem');
  req.send(JSON.stringify({ id: parentId, content: text }));
};

const removeTodo = () => {
  const list = document.querySelector('#todoList');
  const cardId = event.target.parentElement.id;
  const card = document.getElementById(cardId);
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (req.status === 200) {
      list.removeChild(card);
    }
  };

  req.open('POST', '/removeTodo');
  req.send(cardId);
};

const fetchAllTodoCards = () => {
  const req = new XMLHttpRequest();

  req.onload = function() {
    const todoList = document.querySelector('#todoList');

    const allTodoCards = JSON.parse(req.responseText);
    todoList.innerHTML = allTodoCards
      .map(todoCard => {
        return `<div class="card" id="${todoCard.id}">${toHtml(
          todoCard.title,
          todoCard.tasks
        )}</div>`;
      })
      .join('');
  };
  req.open('GET', '/allTodo');
  req.send();
};

const toggleStatus = () => {
  const cardId = event.target.parentElement.parentElement.parentElement.id;
  const taskId = event.target.parentElement.id;

  const req = new XMLHttpRequest();

  req.open('POST', '/toggleIsDoneStatus');
  req.send(JSON.stringify({ cardId, taskId }));
};

window.onload = fetchAllTodoCards;
