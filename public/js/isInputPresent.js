const isInputPresent = () =>
  document.querySelector('#addTodoTitle').value ? makeTodoCard() : showRequired();
