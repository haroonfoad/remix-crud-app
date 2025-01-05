// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-postgres';

import pkg from 'pg';
const {Pool} = pkg;

const pool = new Pool({
  host: "localhost",
  database: "test",
  user: "postgres",
  password: "postgres",
  port: 5432,
});

export const db = drizzle(pool);