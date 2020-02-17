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

  isValid(password) {
    return this.password === password;
  }

  getTodoCards() {
    return this.todoCards;
  }
  toJson() {
    const { todoCards, email, password } = this;
    return { email, password, todoCards: todoCards.toJson() };
  }
}

class Users {
  constructor() {
    this.usersData = {};
  }
  addUser({ username, email, password }) {
    const user = new User(email, password);
    this.usersData[username] = user;
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

  getTodoCards(username) {
    const user = this.usersData[username];
    if (user) {
      return user.getTodoCards();
    };
  }

  isUserExists(username) {
    return username in this.usersData;
  }

  isValidCredentials(username, password) {
    if (this.isUserExists(username)) {
      return this.usersData[username].isValid(password);
    }
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