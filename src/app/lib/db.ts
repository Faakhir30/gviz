import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  database: "gviz0",
  user: "root",
  password: "1234",
});

interface QueryParams {
  query: string;
  values?: any[];
}

export async function query({ query, values }: QueryParams) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}
