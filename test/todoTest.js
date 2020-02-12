const { assert } = require('chai');
const { TodoCards } = require('../lib/todo');

const todoList = [
  {
    id: 1,
    title: 'test',
    tasks: [
      { id: 11, content: 'data1', hasDone: false },
      { id: 12, content: 'data2', hasDone: true }
    ]
  },
  {
    id: 2,
    title: 'test2',
    tasks: [
      { id: 21, content: 'data3', hasDone: false },
      { id: 22, content: 'data4', hasDone: true }
    ]
  }
];

describe('TodoList', () => {
  describe('loadTodoList', () => {
    it('should return instance of a TodoList class with given content', () => {
      const todoCards = TodoCards.load(todoList);
      assert.isTrue(todoCards instanceof TodoCards);
    });
  });

  describe('addNewTodo', () => {
    const todoCards = TodoCards.load([]);
    it('should add a todo to the todoList and return true ', () => {
      const isTodoAdded = todoCards.addNewTodo(todoList[0]);
      assert.isTrue(isTodoAdded);
    });
    it('should not add a todo to the todoList and return false ', () => {
      const isTodoAdded = todoCards.addNewTodo({ title: 'title' });
      assert.isFalse(isTodoAdded);
    });
  });

  describe('removeCard', () => {
    const todoCards = TodoCards.load(todoList);
    it('should remove todo to the todoList and return true ', () => {
      const isTodoRemoved = todoCards.removeCard(1);
      assert.isTrue(isTodoRemoved);
    });
    it('should not remove todo to the todoList and return false when id is not present ', () => {
      const isTodoRemoved = todoCards.removeCard(6);
      assert.isFalse(isTodoRemoved);
    });

    it('should not remove todo to the todoList and return false when id is undefined', () => {
      const isTodoRemoved = todoCards.removeCard();
      assert.isFalse(isTodoRemoved);
    });
  });
});
