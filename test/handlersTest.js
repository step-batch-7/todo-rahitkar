const fs = require('fs');
const request = require('supertest');
const app = require('../lib/handlers');
const { DATA_STORE } = require('../lib/config');

describe('GET method', () => {
  it('should direct to index.html for / path', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(/<title>todo<\/title>/)
      .expect(200, done);
  });
  it('should fetch all todo cards for /allTodo path', done => {
    request(app.serve.bind(app))
      .get('/allTodo')
      .set('Accept', '*/*')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });
  it('should respond with style.css for css/style.css path', (done) => {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('content-type', /css/)
      .expect(200, done);
  });
  it('should respond with logo.png for img/logo.png path', function(done) {
    request(app.serve.bind(app))
      .get('/img/logo.png')
      .set('Accept', '*/*')
      .expect('content-type', /image/)
      .expect(200, done);
  });
  it('should respond with status code 404 for non existing file', (done) => {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});
