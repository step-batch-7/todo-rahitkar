const toHtml = function(title, items) {
  return (
    `</br><div class="card">
    <div class="todoHeader"><h4 style="color: rgba(0,0,0,0.7);">${title}</h4></div>` +
    items
      .map(item => {
        return `<div class="todoItem">
    <input type="checkbox"/><input type="text" name="todo item" class="textInput">${item.content}<br />
  </div><br>`;
      })
      .join('') +
    `</div>`
  );
};

const makeTodoCard = () => {
  const title = document.querySelector('#title').value;
  const todoItems = document.querySelector('#todoBox').value.split('\n');

  const newTodoData = {
    title: title,
    tasks: todoItems
  };

  const req = new XMLHttpRequest();

  req.onload = function() {
    const todoList = document.querySelector('#todoList');
    const newTodo = document.createElement('div');
    const resText = JSON.parse(this.responseText);
    newTodo.innerHTML = toHtml(resText.title, resText.tasks);

    todoList.appendChild(newTodo);
  };
  req.open('POST', '/index.html');
  req.send(JSON.stringify(newTodoData));
};

const fetchAllTodoCards = () => {
  const req = new XMLHttpRequest();

  req.onload = function() {
    const todoList = document.querySelector('#todoList');
    const newTodo = document.createElement('div');

    const allTodoCards = JSON.parse(this.responseText);
    console.log(allTodoCards);
    newTodo.innerHTML = allTodoCards.map((todoCard) => toHtml(todoCard.title, todoCard.tasks)) ;

    todoList.appendChild(newTodo);
  };
  req.open('GET', '/allTodo');
  req.send();
};

window.onload = fetchAllTodoCards;
