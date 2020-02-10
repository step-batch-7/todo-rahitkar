const okStatusCode = 200;

const toHtml = function(cardId, title, items) {
  const html =
    `
    <div class="todoHeader"><input value="${title}" class="todoTitle";" onchange="editTitle('${cardId}')"/></div><div class="crossDiv"><span onclick= removeTodo() class="crossButton">X</span></div>` +
    `<div style="justify-content:flex-start; margin-top:10px;"><div id="todoss-${cardId}" class="todoArea">` +
    items
      .map(item => {
        return (
          `<div class="todoItem" id="${item.id}">` +
          makeItemHtml(cardId, item) +
          '</div><br></br>'
        );
      })
      .join('') +
    `</div><input id="textArea" type="text" class="textArea" name="comments" placeholder=" add todo item ..."/><button class="button"onclick="addTodoItem('${cardId}', '${title}')">+</button></div>`;

  return html;
};

const makeItemHtml = (cardId, item) => {
  const { id, content, hasDone } = item;
  let checked = '';
  if (hasDone) {
    checked = 'checked';
  }
  return `
    <div class="todoItem" id="${id}" onmouseover="show('${id +
    1}')" onmouseout="hide('${id + 1}')">
      <input type="checkbox" onclick="toggleStatus('${cardId}', '${id}')" id="${id +
    2}" ${checked}/> &nbsp <input value="${content}" class="itemContent" onchange="editItem('${cardId}', '${id}')"/><span id="${id + 1}"class="hide" onclick="deleteItem('${cardId}', '${id}')"> &nbsp X</span></div><br /> 
   `;
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

const makeTodoCard = () => {
  const title = document.querySelector('#addTodoTitle').value;

  document.querySelector('#addTodoTitle').value = '';

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

const removeTodo = () => {
  const list = document.querySelector('#todoList');
  const cardId = event.target.parentElement.parentElement.id;
  const card = document.getElementById(cardId);
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (req.status === okStatusCode) {
      list.removeChild(card);
    }
  };

  req.open('POST', '/removeTodo');
  req.send(cardId);
};

const addTodoItem = cardId => {
  const allTextAreas = Array.from(document.querySelectorAll('#textArea'));
  const texts = allTextAreas.map(text => text.value);
  const [text] = texts.filter(text => text);
  if (!text) {
    return;
  }
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

const deleteItem = (cardId, taskId) => {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === okStatusCode) {
      const itemToDelete = document.getElementById(taskId);
      itemToDelete.remove();
    }
  };
  req.open('POST', '/removeTodoItem');
  req.send(JSON.stringify({ cardId, taskId }));
};

const toggleStatus = (cardId, taskId) => {
  const req = new XMLHttpRequest();

  req.open('POST', '/toggleHasDoneStatus');
  req.send(JSON.stringify({ cardId, taskId }));
};

const editTitle = cardId => {
  const title = event.target.value;
  const req = new XMLHttpRequest();

  req.open('POST', '/editTitle');
  req.send(JSON.stringify({ cardId, title }));
};

const editItem = (cardId, taskId) => {
  const content = event.target.value;

  const req = new XMLHttpRequest();

  req.open('POST', '/editTaskContent');
  req.send(JSON.stringify({ cardId, taskId, content }));
};

window.onload = fetchAllTodoCards;
