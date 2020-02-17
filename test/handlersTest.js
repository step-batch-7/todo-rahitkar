const fs = require('fs');
const request = require('supertest');
const { app } = require('../lib/app');
const { Users } = require('../lib/users');
const sinon = require('sinon');

describe('GET method', () => {
  it('should direct to index.html for / path if cookie not present', done => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect(/<title>todo<\/title>/)
      .expect(/Login/)
      .expect(200, done);
  });

  it('should direct to index.html for /index.html path if cookie is not present', done => {
    request(app)
      .get('/index.html')
      .set('Accept', '*/*')
      .expect(/<title>todo<\/title>/)
      .expect(/Login/)
      .expect(200, done);
  });

  it('should redirect to home.html for /index.html path if cookie is present', done => {
    request(app)
      .get('/index.html')
      .set('Accept', '*/*')
      .set('Cookie', 'userName=12345')
      .expect(302, done)
      .expect('Location', '/home.html');
  });

  it('should redirect to home.html for / path if cookie is present', done => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .set('Cookie', 'userName=12345')
      .expect('Location', '/home.html')
      .expect(302, done);
  });

  it('should direct to home.html for /home.html path if cookie is present', done => {
    request(app)
      .get('/home.html')
      .set('Accept', '*/*')
      .set('Cookie', 'userName=12345')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Todo/)
      .expect(200, done);
  });

  it('should redirect to index.html for /home.html path if cookie is not present', done => {
    request(app)
      .get('/home.html')
      .set('Accept', '*/*')
      .expect(302, done)
      .expect('Location', '/index.html');
  });

  it('should fetch all todo cards for /allTodo path', done => {
    app.locals.sessions.push({ SID: 1234, username: "someName" });
    request(app)
      .get('/allTodo')
      .set('Cookie', 'SID=1234')
      .set('Accept', '*/*')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should redirect to index page when session id not found', done => {
    app.locals.sessions.push({ SID: 1234, username: "someName" });
    request(app)
      .get('/allTodo')
      .set('Cookie', 'SID=123456')
      .set('Accept', '*/*')
      .expect('Location', '/index.html')
      .expect(302, done);
  });

  it('should respond with style.css for css/style.css path', done => {
    request(app)
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('content-type', /css/)
      .expect(200, done);
  });

  it('should respond with logo.png for img/logo.png path', function (done) {
    request(app)
      .get('/img/logo.png')
      .set('Accept', '*/*')
      .expect('content-type', /image/)
      .expect(200, done);
  });

  it('should respond with status code 404 for non existing file', done => {
    app.locals.sessions.push({ SID: 1234, username: "someName" });
    request(app)
      .get('/badFile')
      .set('Cookie', 'SID=1234')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST method', () => {
  beforeEach(() => {
    sinon.replace(fs, 'writeFile', () => { });
    app.locals.sessions.push({ SID: 1234, username: "someName" });
  });
  afterEach(() => sinon.restore());

  it('should add new todoCard for /newTodoCard path', done => {
    request(app)
      .post('/newTodoCard')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"title":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should  remove todo on /removeTodo req', done => {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":2}')
      .expect(200, done);
  });

  it('should toggle the status of task on /toggleHasDoneStatus req', done => {
    request(app)
      .post('/toggleHasDoneStatus')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"1","taskId":"11"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should add one task for /addItem req', done => {
    request(app)
      .post('/addItem')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"id":"1","content":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should remove one task for /removeTodoItem req', done => {
    request(app)
      .post('/removeTodoItem')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"3","taskId":"31"}')
      .expect(200, done);
  });

  it('should edit title of todo for /editTitle req', done => {
    request(app)
      .post('/editTitle')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"3","title":"sampleTitle"}')
      .expect(200, done);
  });

  it('should edit task of a todo for /editTaskContent req', done => {
    request(app)
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"4","content":"sampleTitle", "taskId":"41"}')
      .expect(200, done);
  });

  it('should give Not Found /badUrl req', done => {
    request(app)
      .post('/badUrl')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .expect(404, done)
      .expect(/Cannot POST/);
  });

  it('should give 400 status code for request not having all fields', done => {
    request(app)
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .set('Cookie', 'SID=1234')
      .send('{}')
      .expect(400, done);
  });

  it('should login and redirect to home page for valid credentials', done => {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('username=someName&password=some1234')
      .expect(302, done)
      .expect('Location', '/home.html');
  });

  it('should not login and redirect to index page for invalid credentials', done => {
    request(app)
      .post('/login')
      .set('Accept', '*/*')
      .send('username=someName&password=123242')
      .expect(302, done)
      .expect('Location', '/index.html');
  });

  it('should signup and redirect to index page for valid details', done => {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('username=step&password=some1234&email=step7@gmail.com')
      .expect(302, done)
      .expect('Location', '/index.html');
  });

  it('should not signup and redirect to signup page for invalid details', done => {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('username=someName&password=123242&email=mail@gmail.com')
      .expect(302, done)
      .expect('Location', '/signup.html');
  })

  it('should not signup and redirect to signup page for invalid email format', done => {
    request(app)
      .post('/signup')
      .set('Accept', '*/*')
      .send('username=someName&password=123242&email=mail@yahoo.com')
      .expect(302, done)
      .expect('Location', '/signup.html');
  })
});

describe('PUT', () => {
  it('should give method not allowed', done => {
    app.locals.sessions.push({ SID: 1234, username: "rahit" });
    request(app)
      .put('/badUrl')
      .set('Cookie', 'SID=1234')
      .expect(404, done)
      .expect(/Cannot PUT/);
  });
});
