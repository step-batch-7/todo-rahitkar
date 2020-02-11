class TodoItem {
  constructor({ id, content, hasDone = false }) {
    this.id = id;
    this.content = content;
    this.hasDone = hasDone;
  }

  toggleStatus() {
    this.hasDone = !this.hasDone;
  }

  editContent(content) {
    this.content = content;
  }
}

class TodoCard {
  constructor({ id, title }) {
    this.id = id;
    this.title = title;
    this.tasks = [];
  }
  static createCard({ id, title, tasks }) {
    const todoCard = new TodoCard({ id, title });
    todoCard.tasks = tasks.map(task => new TodoItem(task));
    return todoCard;
  }
  addItem(taskId, content) {
    const task = { id: taskId, content: content };
    this.tasks.push(new TodoItem(task));
  }

  removeItem(taskId) {
    const indxOfItem = this.tasks.findIndex(task => task.id === taskId);

    delete this.tasks[indxOfItem];
    this.tasks = this.tasks.filter(task => task);
  }

  editTitle(title) {
    this.title = title;
  }

  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }
}

class TodoCards {
  constructor() {
    this.todoCards = [];
  }
  static load(todoCards) {
    const todoList = new TodoCards();
    todoCards.forEach(todoCard =>
      todoList.todoCards.push(TodoCard.createCard(todoCard))
    );
    return todoList;
  }
  addNewTodo(newTodoData) {
    this.todoCards.unshift(new TodoCard(newTodoData));
  }
  removeCard(cardId) {
    const targetCard = this.todoCards.find(card => {
      return card.id === cardId;
    });
    const inxOfTargetCard = this.todoCards.indexOf(targetCard);
    delete this.todoCards[inxOfTargetCard];
    this.todoCards = this.todoCards.filter(card => card);
  }
  getCard(cardId) {
    return this.todoCards.find(card => card.id === cardId);
  }
}

module.exports = { TodoCards };
