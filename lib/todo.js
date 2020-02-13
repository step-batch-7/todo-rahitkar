class TodoItem {
  constructor(id, content, hasDone = false) {
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
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.tasks = [];
  }

  addItem(taskId, content, hasDone) {
    this.tasks.push(new TodoItem(taskId, content, hasDone));
  }

  removeItem(taskId) {
    const itemIndex = this.tasks.findIndex(task => task.id === taskId);
    this.tasks.splice(itemIndex, 1);
  }

  toggleStatus(taskId) {
    const task = this.getTask(taskId);
    task.toggleStatus();
  }

  editTitle(title) {
    this.title = title;
  }

  editTaskContent(taskId, content) {
    const task = this.getTask(+taskId);
    task.editContent(content);
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
    todoCards.forEach(({ id, title, tasks }) => {
      const todoCard = new TodoCard(id, title);
      todoList.todoCards.push(todoCard);
      tasks.forEach(task =>
        todoCard.addItem(task.id, task.content, task.hasDone)
      );
    });
    return todoList;
  }

  addNewTodo(newTodoData) {
    const { id, title } = newTodoData;
    if (id && title) {
      this.todoCards.unshift(new TodoCard(id, title));
      return true;
    }
    return false;
  }

  removeCard(cardId) {
    if (cardId) {
      const targetCardIndex = this.todoCards.findIndex(card => card.id === cardId);
      if (targetCardIndex === -1) {
        return false;
      }
      this.todoCards.splice(targetCardIndex, 1);
      return true;
    }
    return false;
  }

  toggleStatus(cardId, taskId) {
    const card = this.getCard(+cardId);
    card.toggleStatus(taskId);
  }

  editTaskContent(cardId, taskId, content) {
    const card = this.getCard(+cardId);
    card.editTaskContent(taskId, content);
  }

  addItem(cardId, taskId, content) {
    const card = this.getCard(cardId);
    card.addItem(taskId, content);
  }

  removeItem(cardId, taskId) {
    const card = this.getCard(cardId);
    card.removeItem(taskId);
  }

  editTitle(cardId, title) {
    const card = this.getCard(cardId);
    card.editTitle(title)
  }

  getTask(cardId, taskId) {
    const card = this.getCard(cardId);
    return card.getTask(taskId);
  }

  getCard(cardId) {
    return this.todoCards.find(card => card.id === cardId);
  }
}

module.exports = { TodoCards };
