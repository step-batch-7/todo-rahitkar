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

  describe('getCard', () => {
    const todoCards = TodoCards.load(todoList);
    it('should give todo from the todoList  ', () => {
      const card = JSON.stringify(todoCards.getCard(1));
      assert.strictEqual(card, JSON.stringify(todoList[0]));
    });
    it('should give undefined when id is not present ', () => {
      assert.isUndefined(todoCards.getCard(1111));
    });

    it('should give undefined todo when id is undefined', () => {
      assert.isUndefined(todoCards.getCard());
    });
  });

  describe("addTodoItem", function () {
    const todoCards = TodoCards.load(todoList);
    it("should add a item to a todo card", function () {
      const isItemAdded = todoCards.addItem(1, 14, 'hello');
      assert.isTrue(isItemAdded);
    });
    it("should not add a item to a todo card if cardId is Undefined", function () {
      const isItemAdded = todoCards.addItem(undefined, 14, 'hello');
      assert.isFalse(isItemAdded);
    });
    it("should not add a item to a todo card if taskId is Undefined", function () {
      const isItemAdded = todoCards.addItem(1, undefined, 'hello');
      assert.isFalse(isItemAdded);
    });

    it("should not add a item to a todo card if card is not present", function () {
      const isItemAdded = todoCards.addItem(86, 36, 'hello');
      assert.isFalse(isItemAdded);
    });
  });

  describe("removeTodoItem", function () {
    const todoCards = TodoCards.load(todoList);
    it("should remove a item to a todo card", function () {
      const isItemremoved = todoCards.removeItem(1, 11);
      assert.isTrue(isItemremoved);
    });
    it("should not remove a item to a todo card if cardId is Undefined", function () {
      const isItemremoved = todoCards.removeItem(undefined, 14);
      assert.isFalse(isItemremoved);
    });
    it("should not remove a item to a todo card if taskId is Undefined", function () {
      const isItemremoved = todoCards.removeItem(1, undefined);
      assert.isFalse(isItemremoved);
    });

    it("should not remove a item to a todo card if card is not present", function () {
      const isItemremoved = todoCards.removeItem(86, 36);
      assert.isFalse(isItemremoved);
    });
  });

  describe('getTask', () => {
    const todoCards = TodoCards.load(todoList);
    it('should give task from the  todo in todoList  ', () => {
      const card = JSON.stringify(todoCards.getTask(1, 11));
      assert.strictEqual(card, JSON.stringify(todoList[0].tasks[0]));
    });
    it('should give undefined when cardId is not present ', () => {
      assert.isUndefined(todoCards.getTask(1111, 1));
    });

    it('should give undefined when cardId is undefined', () => {
      assert.isUndefined(todoCards.getTask(undefined, 1));
    });
    it('should give undefined when taskId is not present', () => {
      assert.isUndefined(todoCards.getTask(1, 1111));
    });
    it('should give undefined when taskId is undefined', () => {
      assert.isUndefined(todoCards.getTask(1));
    });
  });

  describe("toggleStatus", function () {
    const todoCards = TodoCards.load(todoList);
    it("should toggle the status of task for given valid cardId and taskId", function () {
      const isToggled = todoCards.toggleStatus(1, 11);
      assert.isTrue(isToggled);
    });
    it("should not toggle the status of task when taskId is not present", function () {
      const isToggled = todoCards.toggleStatus(1, 11111);
      assert.isFalse(isToggled);
    });
    it("should not toggle the status of task when taskId is undefined", function () {
      const isToggled = todoCards.toggleStatus(1);
      assert.isFalse(isToggled);
    });
    it("should toggle the status of task when cardId is not present", function () {
      const isToggled = todoCards.toggleStatus(124, 11);
      assert.isFalse(isToggled);
    });
    it("should toggle the status of task when cardId is undefined", function () {
      const isToggled = todoCards.toggleStatus(undefined, 11);
      assert.isFalse(isToggled);
    });
  });
});
