class TodoItem {
  constructor(task) {
    this.id = task.id;
    this.content = task.content;
    this.hasDone = task.hasDone;
  }

  toggleStatus() {
    this.hasDone = !this.hasDone;
  }

  editContent(content) {
    this.content = content;
  }
}

class TodoCard {
  constructor(card) {
    this.id = card.id;
    this.title = card.title;
    this.tasks = card.tasks;
  }
  static createCard(card) {
    const todoCard = new TodoCard(card);

    todoCard.tasks = todoCard.tasks.map(task => new TodoItem(task));
    return todoCard;
  }
  addItem(taskId, content) {
    const task = { id: taskId, content: content, hasDone: false };
    const newTodoItem = new TodoItem(task);
    this.tasks.push(newTodoItem);
  }

  removeItem(taskId) {
    const indxOfItem = this.tasks.findIndex(task => task.id === taskId);

    delete this.tasks[indxOfItem];
    this.tasks = this.tasks.filter(task => task);
  }

  editTitle(title) {
    this.title = title;
  }

  findTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }
}

class TodoCards {
  constructor() {
    this.todoCards = [];
  }
  static load(fileContent) {
    const todoList = new TodoCards();
    fileContent.forEach(card =>
      todoList.todoCards.push(TodoCard.createCard(card))
    );
    return todoList;
  }
  addNewTodo(newTodoData) {
    const newCard = TodoCard.createCard(newTodoData);
    this.todoCards.unshift(newCard);
  }
  removeCard(cardId) {
    const targetCard = this.todoCards.find(card => {
      return card.id === cardId;
    });
    const inxOfTargetCard = this.todoCards.indexOf(targetCard);
    delete this.todoCards[inxOfTargetCard];
    this.todoCards = this.todoCards.filter(card => card);
  }
  findCard(cardId) {
    return this.todoCards.find(card => card.id === cardId);
  }
}

module.exports = { TodoCards };
