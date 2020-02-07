const isInputPresent = () =>
  document.querySelector('#title').value ? makeTodoCard() : showRequired();
