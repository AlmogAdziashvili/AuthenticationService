/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { statusCodes } = require('../handlers/utils');
const User = require('../models/user');

let Cookie;

before(async () => {
  await User.destroy({
    where: {},
    truncate: true,
  });
});

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
        .send({
          email: 'test@test.com', first_name: 'test', last_name: 'test', password: '123456',
        })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Valid Data: Code 201', (done) => {
      request(app)
        .post('/api/user')
        .set({ Accept: 'application/json' })
        .send({
          email: 'test@test.com', first_name: 'test', last_name: 'test', password: 'Aa123456',
        })
        .expect(statusCodes.created, done);
    });
    it('Email exists: Code 400', (done) => {
      request(app)
        .post('/api/user')
        .set({ Accept: 'application/json' })
        .send({
          email: 'test@test.com', first_name: 'test', last_name: 'test', password: '123456',
        })
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
        .expect(statusCodes.OK)
        .then((res) => {
          const jwtCookie = res.header['set-cookie'][0].substring(4, res.header['set-cookie'][0].indexOf(';'));
          Cookie = [`jwt=${jwtCookie}`];
          return done();
        });
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
  describe('PUT /api/user/reset/:token', () => {
    let token;
    before(async () => {
      const user = await User.findOne({ where: { email: 'test@test.com' } });
      token = user.resetPasswordToken;
    });
    it('Missing Data: Code 400', (done) => {
      request(app)
        .put(`/api/user/reset/${token}`)
        .set({ Accept: 'application/json' })
        .send({})
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Unvalid Data: Code 400', (done) => {
      request(app)
        .put(`/api/user/reset/${token}`)
        .set({ Accept: 'application/json' })
        .send({ password: '123456' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Token not Exists: Code 404', (done) => {
      request(app)
        .put(`/api/user/reset/0${token}`)
        .set({ Accept: 'application/json' })
        .send({ password: 'Bb123456' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.notFound, done);
    });
    it('Valid Data: Code 200', (done) => {
      request(app)
        .put(`/api/user/reset/${token}`)
        .set({ Accept: 'application/json' })
        .send({ password: 'Bb123456' })
        .expect(statusCodes.OK, done);
    });
  });
});

describe('User', () => {
  describe('GET /api/user/current', () => {
    it('Code 200', (done) => {
      request(app)
        .get('/api/user/current')
        .set({ Cookie, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.OK, done);
    });
  });
  describe('POST /api/user', () => {
    it('Code 401', (done) => {
      request(app)
        .post('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
  });
  describe('POST /api/user/login', () => {
    it('Code 401', (done) => {
      request(app)
        .post('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.unauthorized, done);
    });
  });
  describe('PUT /api/user', () => {
    it('Missing Data: Code 400', (done) => {
      request(app)
        .put('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .send({})
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Unvalid Data: Code 400', (done) => {
      request(app)
        .put('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .send({ last_name: '123' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Valid Data: Code 200', (done) => {
      request(app)
        .put('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .send({ last_name: 'TestT' })
        .expect(statusCodes.OK, done);
    });
  });
  describe('DELETE /api/user', () => {
    it('Unvalid ID: Code 400', (done) => {
      request(app)
        .delete('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .send({ id: 'a' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
    it('Valid ID: Code 200', (done) => {
      request(app)
        .delete('/api/user')
        .set({ Cookie, Accept: 'application/json' })
        .send({ id: '1' })
        .expect(statusCodes.OK, done);
    });
  });
});
