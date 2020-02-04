const toHtml = function(title, items) {
  return (
    `<div class="todoHeader"><h4 style="color: rgba(0,0,0,0.7);">${title}</h4></div>` +
    items
      .map(item => {
        return `<div class="todoItem"  onmouseover="show() id="${item.id}"">
    <input type="checkbox" id="${item.id}"/><label for="${item.id}">${item.content}</label><br />
  </div><br>`;
      })
      .join('')
  );
};

const makeTodoCard = () => {
  const title = document.querySelector('#title').value;
  const todoItems = document.querySelector('#todoBox').value.split('\n');
  document.querySelector('#title').value = '';
  document.querySelector('#todoBox').value = '';

  const newTodoData = {
    title: title,
    tasks: todoItems
  };

  const req = new XMLHttpRequest();

  req.onload = function() {
    const todoList = document.querySelector('#todoList');
    const newTodo = document.createElement('div');
    newTodo.className = 'card';
    const resText = JSON.parse(this.responseText);
    newTodo.setAttribute('id', this.resText.id);
    newTodo.innerHTML = toHtml(resText.title, resText.tasks);

    todoList.prepend(newTodo);
  };
  req.open('POST', '/index.html');
  req.send(JSON.stringify(newTodoData));
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
