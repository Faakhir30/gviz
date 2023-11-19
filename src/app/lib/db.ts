import mysql from "mysql2/promise";
interface QueryParams {
  query: string;
  values?: any[];
}
export async function query({ query, values }: QueryParams) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      database: "gviz0",
      user: "root",
      password: "1234",
    });

    const [results] = await db.execute(query, values);
    await db.end();
    return results;
  } catch (error) {
    console.log("\n\n\n\nerror:asd  ", error);
    throw error;
  }
}
