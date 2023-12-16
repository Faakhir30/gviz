import mysql from "mysql2/promise";

// Create a connection pool
let pool = mysql.createPool({
  host: "localhost",
  database: "gviz0",
  user: "root",
  password: "1234",
});

interface QueryParams {
  query: string;
  values?: any[];
  poolInfo?: PoolConect;
}
interface PoolConect {
  host: string;
  database: string;
  user: string;
  password: string;
}
export async function poolConect(data:PoolConect){
  try{
    const newPool = mysql.createPool(data);
    pool = newPool;
  }catch(error){
    return {status:500, message:error};
  }
  return {status:200, message:"ok"};
}

export async function query({ query, values, poolInfo }: QueryParams) {
  if(poolInfo){
    await poolConect(poolInfo);
  }
  
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
