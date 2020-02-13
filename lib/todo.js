class TodoItem {
  constructor(id, content, hasDone = false) {
    this.id = id;
    this.content = content;
    this.hasDone = hasDone;
  }

  toggleStatus() {
    this.hasDone = !this.hasDone;
    console.log(this);
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

  getCard(cardId) {
    return this.todoCards.find(card => card.id === cardId);
  }
}

module.exports = { TodoCards };
