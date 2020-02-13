const fs = require('fs');
const request = require('supertest');
const app = require('../lib/handlers');
const sinon = require('sinon');

describe('GET method', () => {
  it('should direct to entryPage.html for / path if cookie not present', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Login/)
      .expect(/Signup/)
      .expect(200, done);
  });

  it('should direct to entryPage.html for /entryPage.html path if cookie is not present', done => {
    request(app.serve.bind(app))
      .get('/entryPage.html')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Login/)
      .expect(/Signup/)
      .expect(200, done);
  });

  it('should direct to index.html for /entryPage.html path if cookie is present', done => {
    request(app.serve.bind(app))
      .get('/entryPage.html')
      .set('Accept', '*/*')
      .set('Cookie', '{"user":"step7","password":"1234"}')
      .expect('Location', '/index.html')
      .expect(301, done);
  });

  it('should direct to index.html for / path if cookie is present', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .set('Cookie', '{"user":"step7","password":"1234"}')
      .expect('Location', '/index.html')
      .expect(301, done);
  });

  it('should direct to index.html for /index.html path if cookie is present', done => {
    request(app.serve.bind(app))
      .get('/index.html')
      .set('Accept', '*/*')
      .set('Cookie', '{"user":"step7","password":"1234"}')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(/Todo/)
      .expect(200, done);
  });

  it('should direct to entryPage.html for /index.html path if cookie is not present', done => {
    request(app.serve.bind(app))
      .get('/index.html')
      .set('Accept', '*/*')
      .expect('Location', '/entryPage.html')
      .expect(301, done);
  });

  it('should fetch all todo cards for /allTodo path', done => {
    request(app.serve.bind(app))
      .get('/allTodo')
      .set('Accept', '*/*')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });

  it('should respond with style.css for css/style.css path', done => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('content-type', /css/)
      .expect(200, done);
  });
  it('should respond with logo.png for img/logo.png path', function (done) {
    request(app.serve.bind(app))
      .get('/img/logo.png')
      .set('Accept', '*/*')
      .expect('content-type', /image/)
      .expect(200, done);
  });
  it('should respond with status code 404 for non existing file', done => {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST method', () => {
  beforeEach(() => sinon.replace(fs, 'writeFile', () => { }));
  afterEach(() => sinon.restore());

  it('should add new todoCard for /newTodoCard path', done => {
    request(app.serve.bind(app))
      .post('/newTodoCard')
      .set('Accept', '*/*')
      .send('{"title":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should  remove todo on /removeTodo req', done => {
    request(app.serve.bind(app))
      .post('/removeTodo')
      .set('Accept', '*/*')
      .send('{"cardId":2}')
      .expect(200, done);
  });

  it('should toggle the status of task on /toggleHasDoneStatus req', done => {
    request(app.serve.bind(app))
      .post('/toggleHasDoneStatus')
      .set('Accept', '*/*')
      .send('{"cardId":"1","taskId":"11"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should add one task for /addItem req', done => {
    request(app.serve.bind(app))
      .post('/addItem')
      .set('Accept', '*/*')
      .send('{"id":"1","content":"sampleData"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json');
  });

  it('should remove one task for /removeTodoItem req', done => {
    request(app.serve.bind(app))
      .post('/removeTodoItem')
      .set('Accept', '*/*')
      .send('{"cardId":"3","taskId":"31"}')
      .expect(200, done);
  });

  it('should edit title of todo for /editTitle req', done => {
    request(app.serve.bind(app))
      .post('/editTitle')
      .set('Accept', '*/*')
      .send('{"cardId":"3","title":"sampleTitle"}')
      .expect(200, done);
  });

  it('should edit task of a todo for /editTaskContent req', done => {
    request(app.serve.bind(app))
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .send('{"cardId":"4","content":"sampleTitle", "taskId":"41"}')
      .expect(200, done);
  });

  it('should give Not Found /badUrl req', done => {
    request(app.serve.bind(app))
      .post('/badUrl')
      .set('Accept', '*/*')
      .expect(404, done)
      .expect(/Not Found/);
  });

  it('should give 404 status code for request not having all fields', done => {
    request(app.serve.bind(app))
      .post('/editTaskContent')
      .set('Accept', '*/*')
      .send('{}')
      .expect(404, done);
  });
});

describe('PUT', () => {
  it('should give method not allowed', done => {
    request(app.serve.bind(app))
      .put('/badUrl')
      .expect(400, done)
      .expect(/method not allowed/);
  });
});
