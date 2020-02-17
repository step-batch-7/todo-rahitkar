const { assert } = require('chai');
const { Users } = require('../lib/users');

const usersData = {
  "someName": {
    "email": "mail@email.com",
    "password": 1234,
    "todoCards": [
      {
        "id": 1,
        "title": "test",
        "tasks": [
          { "id": 11, "content": "data1", "hasDone": false },
          { "id": 12, "content": "data2", "hasDone": true }
        ]
      }
    ]
  }
};

describe("Users", function () {

  describe("load", function () {
    it("should load all user data", function () {
      const users = Users.load(usersData);
      assert.isTrue(users instanceof Users);
    });
  });
  describe("addUser", function () {
    it("should add a user having username, email and password", () => {
      const users = Users.load(usersData);
      const username = 'someName';
      const email = 'some@gmail.com';
      const password = '1234'
      assert.isTrue(users.addUser({ username, email, password }))
    });

    it("should not add a user not having any one of username, email and password", () => {
      const users = Users.load(usersData);
      const username = 'someName';
      const email = 'some@gmail.com';
      assert.isFalse(users.addUser({ username, email }))
    });
  });

  describe("getTodoCards", function () {
    it("should get a card of valid userName", function () {
      const users = Users.load(usersData);
      const actual = JSON.stringify(users.getTodoCards('someName'));
      const expected = JSON.stringify({ todoCards: usersData.someName['todoCards'] });
      assert.equal(actual, expected);
    });

    it("should get a card of valid userName", function () {
      const users = Users.load(usersData);
      assert.isUndefined(users.getTodoCards('someOtherName'));
    });
  });

  describe("isUserExists", function () {
    it("should return true when username is present", function () {
      const users = Users.load(usersData);
      assert.isTrue(users.isUserExists('someName'));
    });

    it("should return false when username is not present", function () {
      const users = Users.load(usersData);
      assert.isFalse(users.isUserExists('someOtherName'));
    });
  });

  describe("isValidCredentials", function () {
    it("should return true when username and password are valid", function () {
      const users = Users.load(usersData);
      assert.isTrue(users.isValidCredentials('someName', 1234));
    });

    it("should return false when username is not valid", function () {
      const users = Users.load(usersData);
      assert.isFalse(users.isValidCredentials('someOtherName', 1234));
    });

    it("should return false when password is not valid", function () {
      const users = Users.load(usersData);
      assert.isFalse(users.isValidCredentials('someName', 123456));
    });
  });

  describe("toJson", function () {
    it("should give Json ", function () {
      const users = Users.load(usersData);
      const actual = users.toJson();
      const expected = JSON.stringify(usersData);
      assert.strictEqual(actual, expected);
    });
  });
});