module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    searchPath: ['public'],
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    useNullAsDefault: true,
  },
  test: {
    searchPath: ['public'],
    migrations: {
      directory: 'src/db/migrations',
    },
    seeds: {
      directory: 'src/db/seeds',
    },
    useNullAsDefault: true,
  },
};
