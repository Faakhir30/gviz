import mysql from "mysql2/promise";
interface QueryParams {
  query: string;
  params?: any[];
}
export async function query({ query, params }: QueryParams) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      database: "sakila",
      //   port: 8889,
      user: "root",
      password: "12312312",
      // socketPath: "/var/run/mysqld/mysqld.sock",,
    });

    const [results] = await db.execute(query, params);
    db.end();
    return results;
  } catch (error) {
    console.log("\n\n\n\nerror:asd  ", error);
  }
}
