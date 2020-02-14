const fs = require('fs');
const request = require('supertest');
const { app } = require('../lib/routes');
const sinon = require('sinon');

describe('GET method', () => {
  it('should direct to index.html for / path if cookie not present', done => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Login/)
      .expect(/Signup/)
      .expect(200, done);
  });

  it('should direct to index.html for /index.html path if cookie is not present', done => {
    request(app)
      .get('/index.html')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Login/)
      .expect(/Signup/)
      .expect(200, done);
  });

  it('should direct to home.html for /index.html path if cookie is present', done => {
    request(app)
      .get('/index.html')
      .set('Accept', '*/*')
      .set('Cookie', '{"user":"step7","password":"1234"}')
      .expect(302, done)
      .expect('Location', '/home.html');
  });

  it('should direct to home.html for / path if cookie is present', done => {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .set('Cookie', '{"user":"step7","password":"1234"}')
      .expect('Location', '/home.html')
      .expect(302, done);
  });

  it('should direct to home.html for /home.html path if cookie is present', done => {
    request(app)
      .get('/home.html')
      .set('Accept', '*/*')
      .set('Cookie', '{"user":"step7","password":"1234"}')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Todo/)
      .expect(200, done);
  });

  it('should direct to index.html for /home.html path if cookie is not present', done => {
    request(app)
      .get('/home.html')
      .set('Accept', '*/*')
      .expect(302, done)
      .expect('Location', '/index.html');
  });

  it('should fetch all todo cards for /allTodo path', done => {
    request(app)
      .get('/allTodo')
      .set('Accept', '*/*')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
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
    request(app)
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST method', () => {
  beforeEach(() => sinon.replace(fs, 'writeFile', () => { }));
  afterEach(() => sinon.restore());

  it('should add new todoCard for /newTodoCard path', done => {
    request(app)
      .post('/newTodoCard')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"title":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should  remove todo on /removeTodo req', done => {
    request(app)
      .post('/removeTodo')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":2}')
      .expect(200, done);
  });

  it('should toggle the status of task on /toggleHasDoneStatus req', done => {
    request(app)
      .post('/toggleHasDoneStatus')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"1","taskId":"11"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should add one task for /addItem req', done => {
    request(app)
      .post('/addItem')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"id":"1","content":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should remove one task for /removeTodoItem req', done => {
    request(app)
      .post('/removeTodoItem')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"3","taskId":"31"}')
      .expect(200, done);
  });

  it('should edit title of todo for /editTitle req', done => {
    request(app)
      .post('/editTitle')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"3","title":"sampleTitle"}')
      .expect(200, done);
  });

  it('should edit task of a todo for /editTaskContent req', done => {
    request(app)
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .set('Content-Type', 'application/json;charset=UTF-8')
      .send('{"cardId":"4","content":"sampleTitle", "taskId":"41"}')
      .expect(200, done);
  });

  it('should give Not Found /badUrl req', done => {
    request(app)
      .post('/badUrl')
      .set('Accept', '*/*')
      .expect(404, done)
      .expect(/Cannot POST/);
  });

  it('should give 400 status code for request not having all fields', done => {
    request(app)
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .send('{}')
      .expect(400, done);
  });
});

describe('PUT', () => {
  it('should give method not allowed', done => {
    request(app)
      .put('/badUrl')
      .expect(404, done)
      .expect(/Cannot PUT/);
  });
});
