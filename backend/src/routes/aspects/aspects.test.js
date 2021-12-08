import aspects from '.';
import express from 'express';
import axios from 'axios';
import { knex, mockDb } from '../../db';

let server, backup;
const url = 'http://localhost:3001';

beforeAll(async () => {
  // Create all the tables and add initial data
  await knex.migrate.latest();
  await knex.seed.run();

  backup = mockDb.backup();

  const app = express();
  app.use(express.json());
  app.use('/aspects', aspects);
  server = await app.listen(3001);
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

describe('GET /aspects', () => {
  it('get all aspects', async () => {
    const response = await axios.get(`${url}/aspects`);
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    const resData = response.data;
    expect(resData.length).toEqual(15);
    expect(resData[0].name).toEqual('Student engagement');

    const generalAspect = resData.filter((aspect) => aspect.name == 'General');
    expect(generalAspect).toEqual([]);
  });
});
