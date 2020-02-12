const getCards = () => {
  return Array.from(document.querySelectorAll('.card'));
};

const showTodo = todo => todo.classList.remove('hide');

const hideTodo = todo => todo.classList.add('hide');

const searchByName = (todo, searchedText) => {
  const title = todo.querySelector('.todoTitle').value;
  const toggleHide = title.includes(searchedText) ? showTodo : hideTodo;
  toggleHide(todo);
};

const searchByTask = (todo, searchedText) => {
  if (searchedText === '') return searchByName(todo, searchedText);
  const tasks = Array.from(todo.querySelectorAll('.itemContent'));
  const searchedTasks = tasks.filter(task => task.value.includes(searchedText));
  
  const toggleHide = searchedTasks.length !== 0 ? showTodo : hideTodo;
  toggleHide(todo);
};

const search = () => {
  const searchedItem = document.querySelector('#searchedItem').value;
  const searchedText = document.querySelector('.search').value;
  const todoList = getCards();
  const searchItem = searchedItem === 'Title' ? searchByName : searchByTask;
  todoList.forEach(todo => searchItem(todo, searchedText));
};
