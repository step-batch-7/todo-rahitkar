const toHtml = function(title, items) {
  const html =
    `<div class="todoHeader"><h4 style="color: rgba(0,0,0,0.7);">${title}</h4></div><div onclick= removeTodo()>x</div>` +
    '<div style="justify-content:flex-start; margin-top:10px;">' +
    items
      .map(item => {
        return (
          `<div class="todoItem" id="${item.id}">` +
          makeItemHtml(item.id, item.content) +
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

const makeItemHtml = (id, content) => {
  return `
    <input type="checkbox" id="${id +
      Math.random()}"/><label for="${id}">${content}</label><br />
 `;
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
    newTodo.innerHTML = makeCardHtml(
      resText.title
    );

    todoList.prepend(newTodo);
  };
  req.open('POST', '/newTodoCard');
  req.send(JSON.stringify(newTodoData));
};

const addTodoItem = () => {
  const parentId = event.target.parentElement.parentElement.id;
  
  const texts = Array.from(document.querySelectorAll('#textArea')).map(
    text => text.value
  );
  const text = texts.filter(text => text);
  const itemData = { id: parentId, content: text };

  const req = new XMLHttpRequest();
  req.onload = function() {
    const card = document.getElementById(parentId);
    const resText = JSON.parse(this.responseText);
    const item = document.createElement('div');
    item.className = 'todoItem';
    item.innerHTML = makeItemHtml(resText.id, resText.content);
    card.appendChild(item);
  };

  req.open('POST', '/addItem');
  req.send(JSON.stringify(itemData));
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

    const allTodoCards = JSON.parse(this.responseText);
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

window.onload = fetchAllTodoCards;
