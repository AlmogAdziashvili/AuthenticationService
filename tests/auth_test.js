/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { statusCodes } = require('../handlers/utils');

describe('Guest', () => {
  describe('GET /api/user/current', () => {
    it('Code 401', (done) => {
      request(app)
        .get('/api/user/current')
        .set({ Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
  });
  describe('POST /api/user', () => {
    it('Missing Data: Code 400', (done) => {
      request(app)
        .post('/api/user')
        .set({ Accept: 'application/json' })
        .send({})
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Unvalid Data: Code 400', (done) => {
      request(app)
        .post('/api/user')
        .set({ Accept: 'application/json' })
        .send({ email: 'test@test.com', first_name: 'test', last_name: 'test', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Valid Data: Code 201', (done) => {
      request(app)
        .post('/api/user')
        .set({ Accept: 'application/json' })
        .send({ email: 'test@test.com', first_name: 'test', last_name: 'test', password: 'Aa123456' })
        .expect(statusCodes.created, done);
    });
    it('Email exists: Code 400', (done) => {
      request(app)
        .post('/api/user')
        .set({ Accept: 'application/json' })
        .send({ email: 'test@test.com', first_name: 'test', last_name: 'test', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
  });
  describe('POST /api/user/login', () => {
    it('Missing Data: Code 400', (done) => {
      request(app)
        .post('/api/user/login')
        .set({ Accept: 'application/json' })
        .send({})
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('User not Exists: Code 401', (done) => {
      request(app)
        .post('/api/user/login')
        .set({ Accept: 'application/json' })
        .send({ email: 'test2@test.com', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
    it('Wrong Password: Code 401', (done) => {
      request(app)
        .post('/api/user/login')
        .set({ Accept: 'application/json' })
        .send({ email: 'test2@test.com', password: '123456' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
    it('Valid Data: Code 200', (done) => {
      request(app)
        .post('/api/user/login')
        .set({ Accept: 'application/json' })
        .send({ email: 'test@test.com', password: 'Aa123456' })
        .expect(statusCodes.OK, done);
    });
  });
  describe('PUT /api/user', () => {
    it('Code 401', (done) => {
      request(app)
        .put('/api/user')
        .set({ Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
  });
  describe('PUT /api/user', () => {
    it('Code 401', (done) => {
      request(app)
        .put('/api/user')
        .set({ Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
  });
  describe('DELETE /api/user', () => {
    it('Code 401', (done) => {
      request(app)
        .delete('/api/user')
        .set({ Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
  });
  describe('PUT /api/user/reset', () => {
    it('Missing Data: Code 400', (done) => {
      request(app)
        .put('/api/user/reset')
        .set({ Accept: 'application/json' })
        .send({})
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('User not Exists: Code 404', (done) => {
      request(app)
        .put('/api/user/reset')
        .set({ Accept: 'application/json' })
        .send({ email: 'test2@test.com' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.notFound, done);
    });
    it('Valid Data: Code 200', (done) => {
      request(app)
        .put('/api/user/reset')
        .set({ Accept: 'application/json' })
        .send({ email: 'test@test.com' })
        .expect(statusCodes.OK, done);
    });
  });
});
