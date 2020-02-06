/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');
const { statusCodes } = require('../app_handlers/utils');

const ID = 32;

describe('POST /memes', () => {
  describe('Valid Name', () => {
    it('Code 201', (done) => {
      request(app)
        .post('/memes/')
        .send({ name: 'moshe' })
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.created, done);
    });
  });
  describe('Invalid Name', () => {
    it('Code 400', (done) => {
      request(app)
        .post('/memes/')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
  });
});

describe('GET /memes/:ID', () => {
  describe('Valid ID', () => {
    it('ID Found: Code 200', (done) => {
      request(app)
        .get(`/memes/${ID}`)
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.OK, done);
    });
    it('ID Not Found: Code 404', (done) => {
      request(app)
        .get('/memes/0')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.notFound, done);
    });
  });
  describe('Invalid ID', () => {
    it('Code 400', (done) => {
      request(app)
        .get('/memes/a')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
  });
});

describe('GET /memes/?name=:name', () => {
  describe('Valid Name', () => {
    it('Name Found: Code 200', (done) => {
      request(app)
        .get('/memes/?name=moshe')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.OK, done);
    });
    it('Name Not Found: Code 404', (done) => {
      request(app)
        .get('/memes/?name=0')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.notFound, done);
    });
  });
  describe('Invalid Name', () => {
    it('Code 400', (done) => {
      request(app)
        .get('/memes/')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
  });
});

describe('PUT /memes/:ID', () => {
  describe('Valid Parameters', () => {
    it('ID Found: Code 200', (done) => {
      request(app)
        .put(`/memes/${ID}`)
        .send({ name: 'almog3' })
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.OK, done);
    });
    it('ID Not Found: Code 404', (done) => {
      request(app)
        .put('/memes/0')
        .send({ name: 'almog3' })
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.notFound, done);
    });
  });
  describe('Invalid Parameters', () => {
    it('missing name: Code 400', (done) => {
      request(app)
        .put('/memes/26')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
  });
});

describe('DELETE /memes/:ID', () => {
  describe('Valid ID', () => {
    it('ID Found: Code 200', (done) => {
      request(app)
        .delete(`/memes/${ID}`)
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.OK, done);
    });
    it('ID Not Found: Code 404', (done) => {
      request(app)
        .delete('/memes/0')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.notFound, done);
    });
  });
  describe('Invalid ID', () => {
    it('Code 400', (done) => {
      request(app)
        .delete('/memes/a')
        .set({ Accept: 'application/json', Authorization: 'Bearer lXbXuofmUY' })
        .expect('Content-Type', /json/)
        .expect(statusCodes.badRequest, done);
    });
  });
});
