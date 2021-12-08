const { Pool } = require('pg');
const knexfile = require('./knexfile');
const { newDb } = require('pg-mem');

const pool = new Pool();

let knex = null;
let mockDb = null;

if (process.env.NODE_ENV == 'test') {
  mockDb = newDb();
  knex = mockDb.adapters.createKnex(0, knexfile.test);
} else {
  knex = require('knex')(knexfile.development);
}

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  knex,
  mockDb,
};
