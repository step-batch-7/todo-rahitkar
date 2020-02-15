const { TodoCards } = require('./todo');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  loadTodoList(todoCards) {
    this.todoCards = TodoCards.load(todoCards);
  }

  addTodo(todoCard) {
    this.todoCards.addNewTodo(todoCard);
  }

  getTodoCards() {
    return this.todoCards;
  }
  toJson() {
    const { todoCards, email, password } = this;
    return { email, password, todocards: todoCards.toJson() };
  }
}

class Users {
  constructor() {
    this.usersData = {};
  }
  addUser({ userName, email, password }) {
    const user = new User(email, password);
    this.usersData[userName] = user;
    user.loadTodoList([]);
  }

  static load(usersData) {
    const users = new Users();
    for (const userName in usersData) {
      const userData = usersData[userName];
      const { email, password, todoCards } = userData;
      const user = new User(email, password);
      user.loadTodoList(todoCards);
      users.usersData[userName] = user;
    }
    return users;
  }

  getTodoCards(userName) {
    const user = this.usersData[userName];
    if (user) {
      return user.getTodoCards();
    };
  }

  toJson() {
    const usersData = {};
    for (const user in this.usersData) {
      usersData[user] = this.usersData[user].toJson();
    }
    return JSON.stringify(usersData);
  }
}

module.exports = { Users };