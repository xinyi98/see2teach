import prompts from '.';
import express from 'express';
import axios from 'axios';
import { knex, mockDb } from '../../db';

let server, backup;
const url = 'http://localhost:3005';

beforeAll(async () => {
  // Create all the tables and add initial data
  await knex.migrate.latest();
  await knex.seed.run();

  backup = mockDb.backup();

  const app = express();
  app.use(express.json());
  app.use('/prompts', prompts);
  server = await app.listen(3005);
});

afterEach(() => {
  backup.restore();
});

afterAll((done) => {
  server.close(() => {
    knex.destroy();
    done();
  });
});

test('get all prompts ', async () => {
  const res = await axios.get(`${url}/prompts`);
  expect(res.status).toBe(200);
  const data = res.data;
  expect(data).toBeDefined();

  //  length of data
  expect(data.length).toEqual(27);
});
