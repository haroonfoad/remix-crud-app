// import { Pool } from "pg";
import pkg from 'pg';
const {Pool} = pkg;

// Load environment variables from `.env`
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined, // Optional for SSL connections
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
