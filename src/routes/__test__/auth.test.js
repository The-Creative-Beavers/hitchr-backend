const supertest = require('supertest');

const env = require('../../db/env');
const { dbPool } = require('../../db/db');
const App = require('../../app');

describe('Given a blank database', () => {
  let server;
  let pool;
  let client;
  beforeAll(() => {
    pool = dbPool({ ...env, database: 'hitchr_test' });
  });

  beforeEach((done) => {
    (async () => {
      client = await pool.connect();

      server = App(
        5001,
        client,
      );
      done();
    })();
  });
  afterEach(() => {
    server.close();
    client.release();
  });
  afterAll(() => {
    pool.end();
  });

  describe('When a valid POST is made to /create', () => {
    let createResponse;
    beforeEach(async () => {
      createResponse = await supertest(server).post('/api/create');
    });
    test('Then the server responds with 201', () => {
      expect(createResponse.statusCode).toBe(201);
    });
  });
});
