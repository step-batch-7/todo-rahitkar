class TodoItems {
  constructor(title, id, task) {
    this.title = title;
    this.id = id;
    this.task = task;
  }
}

// {todoCards:[]}
class Todo {
  constructor() {
    this.todoCards = [];
  }
  static load(fileContent) {
    const todo = new Todo();

    todo.todoCards = fileContent.todoCards;
    return todo;
  }

  addNewItems(newTodoData) {
    this.todoCards.unshift(newTodoData);
    return this.todoCards;
  }
}

module.exports = Todo;
