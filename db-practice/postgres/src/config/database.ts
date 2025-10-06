import knex from 'knex';

export const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'postgres',
    database: 'postgis'
  }
});

export async function connectDatabase() {
  try {
    await db.raw('SELECT 1');
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    throw error;
  }
}

