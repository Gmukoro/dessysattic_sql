// lib/db.ts
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}) {
  try {
    // Execute the query using the connection pool
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}
