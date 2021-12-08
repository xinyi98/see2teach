import login from '.';
import express from 'express';
import axios from 'axios';
import { knex, mockDb } from '../../db';

let server, backup;
const url = 'http://localhost:3002';

beforeAll(async () => {
  // Create all the tables and add initial data
  await knex.migrate.latest();
  await knex.seed.run();

  backup = mockDb.backup();

  const app = express();
  app.use(express.json());
  app.use('/login', login);
  server = await app.listen(3002);
});

// Reset the database
afterEach(() => {
  backup.restore();
});

afterAll((done) => {
  server.close(() => {
    knex.destroy();
    done();
  });
});

describe('GET /login', () => {
  it('login with a valid upi', async () => {
    const response = await axios.get(`${url}/login`, { params: { upi: 'abcd123' } });
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.id).toEqual(123456789);
    expect(resData.upi).toEqual('abcd123');
    expect(resData.name).toEqual('John Doe');
  });

  it('login with an invalid upi', async () => {
    try {
      await axios.get(`${url}/login`, { params: { upi: 'ab123' } });
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(401);
    }
  });

  it('login with missing upi', async () => {
    try {
      await axios.get(`${url}/login`, { params: {} });
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(401);
    }
  });

  it('login with an empty upi', async () => {
    try {
      await axios.get(`${url}/login`, { params: { upi: '' } });
    } catch (err) {
      const { response } = err;
      expect(response).toBeDefined();
      expect(response.status).toBe(401);
    }
  });
});
