const toHtml = function(cardId, title, items) {
  const html =
    `
    <div class="todoHeader"><h4 style="color: rgba(0,0,0,0.7);">${title}</h4></div><div onclick= removeTodo() class="crossButton">X</div>` +
    `<div style="justify-content:flex-start; margin-top:10px;"><div id="todoss-${cardId}">` +
    items
      .map(item => {
        return (
          `<div class="todoItem" id="${item.id}">` +
          makeItemHtml(cardId, item) +
          '</div><br></br>'
        );
      })
      .join('') +
    `</div><input id="textArea" type="text" class="textArea" name="comments"/><button class="button"onclick="addTodoItem('${cardId}', '${title}')">+</button></div>`;

  return html;
};

const makeItemHtml = (cardId, item) => {
  const { id, content, isDone } = item;
  if (isDone) {
    return `
    <div class="todoItem" id="${item.id}">
      <input type="checkbox" onclick="toggleStatus('${cardId}', '${id}')" id="${id +
      Math.random()}" checked/><label for="${id}">${content}<span onclick="deleteItem('${cardId}', '${id}')" style="color: red;">  X</span></label></div><br />
   `;
  }
  return `
  <div class="todoItem" id="${item.id}">
  <input type="checkbox" onclick="toggleStatus('${cardId}', '${id}')" /><label for="${id}">${content}<span onclick="deleteItem('${cardId}', '${id}')" style="color: red;">  X</span></label></div><br />
`;
};

const deleteItem = (cardId, taskId) => {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      const itemToDelete = document.getElementById(taskId);
      itemToDelete.remove();
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
    newTodo.innerHTML = toHtml(resText.id, resText.title, []);

    todoList.prepend(newTodo);
  };
  req.open('POST', '/newTodoCard');
  req.send(JSON.stringify(newTodoData));
};

const addTodoItem = cardId => {
  const allTextAreas = Array.from(document.querySelectorAll('#textArea'));
  const texts = allTextAreas.map(text => text.value);
  const [text] = texts.filter(text => text);

  allTextAreas.forEach(textArea => {
    textArea.value = '';
  });

  const req = new XMLHttpRequest();
  req.onload = function() {
    const card = document.getElementById(`todoss-${cardId}`);
    const resText = JSON.parse(this.responseText);
    const item = document.createElement('div');
    item.className = 'todoItem';
    item.innerHTML = makeItemHtml(cardId, resText) + '</br></br>';
    card.appendChild(item);
  };

  req.open('POST', '/addItem');

  req.send(JSON.stringify({ id: cardId, content: text }));
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
          todoCard.id,
          todoCard.title,
          todoCard.tasks
        )}</div>`;
      })
      .join('');
  };
  req.open('GET', '/allTodo');
  req.send();
};

const toggleStatus = (cardId, taskId) => {
  const req = new XMLHttpRequest();

  req.open('POST', '/toggleIsDoneStatus');
  req.send(JSON.stringify({ cardId, taskId }));
};

window.onload = fetchAllTodoCards;
