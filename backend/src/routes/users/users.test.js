import users from '.';
import express from 'express';
import axios from 'axios';
import { knex, mockDb } from '../../db';

let server, backup;
const url = 'http://localhost:3004';

beforeAll(async () => {
  // Create all the tables and add initial data
  await knex.migrate.latest();
  await knex.seed.run();

  backup = mockDb.backup();

  const app = express();
  app.use(express.json());
  app.use('/users', users);
  server = await app.listen(3004);
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

describe('GET /users', () => {
  it('get all users', async () => {
    const response = await axios.get(`${url}/users`);
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.length).toEqual(3);
    expect(resData[0].id).toEqual(123456789);
    expect(resData[0].upi).toEqual('abcd123');
    expect(resData[0].name).toEqual('John Doe');

    expect(resData[1].id).toEqual(987654321);
    expect(resData[1].upi).toEqual('wxyz123');
    expect(resData[1].name).toEqual('Jane Doe');

    expect(resData[2].id).toEqual(555555555);
    expect(resData[2].upi).toEqual('qwer123');
    expect(resData[2].name).toEqual('Test User');
  });
});
