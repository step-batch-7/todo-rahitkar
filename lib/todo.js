class TodoItem {
  constructor(task) {
    this.id = task.id;
    this.content = task.content;
    this.isDone = task.isDone;
  }
}

class TodoCard {
  constructor(card) {
    this.id = card.id;
    this.title = card.title;
    this.tasks = card.tasks;
  }
  static loadTodoCard(card) {
    const todoCard = new TodoCard(card);
    todoCard.tasks.forEach(task => new TodoItem(task));
    return todoCard;
  }
}

class TodoCards {
  constructor() {
    this.todoCards = [];
  }
  static load(fileContent) {
    const todoList = new TodoCards();
    fileContent.forEach(card =>
      todoList.todoCards.push(TodoCard.loadTodoCard(card))
    );
    return todoList;
  }
  addNewTodo(newTodoData) {
    const newCard = TodoCard.loadTodoCard(newTodoData);
    this.todoCards.unshift(newCard);
    return this.todoCards;
  }
  removeCard(cardId) {
    const targetCard = this.todoCards.find(card => {
      return card.id === cardId;
    });
    const inxOfTargetCard = this.todoCards.indexOf(targetCard);
    delete this.todoCards[inxOfTargetCard];
    const remainingCards = this.todoCards.filter(card => card);
    return remainingCards;
  }
}

module.exports = TodoCards;
