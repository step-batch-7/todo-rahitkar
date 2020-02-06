// const makeNewTodoData = function(body) {
//   const id = new Date().getTime().toString();
//   return {
//     id: id,
//     title: body.title,
//     tasks: []
//   };
// };

class TodoItem {
  constructor(id, content, isDone) {
    this.id = id;
    this.content = content;
    this.isDone = isDone;
  }
}

// {todoCards:[]}
class Todo {
  constructor() {
    this.todoCards = [];
  }
  static load(fileContent) {
    const todo = new Todo();

    fileContent.todoCards.forEach(card => {
      card.tasks(task => new TodoItem(task.id, task.content, task.isDone));
    });
    todo.todoCards = fileContent;
    return todo;
  }

  addNewItems(newTodoData) {
    this.todoCards.unshift(newTodoData);
    return this.todoCards;
  }
}

module.exports = Todo;
