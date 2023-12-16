import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Create a connection pool

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
export async function query({ query, values, poolInfo }: QueryParams) {
    let pool
    if(poolInfo){
        pool = mysql.createPool(poolInfo);
    }else{
        pool= mysql.createPool({
            host: "localhost",
            database: "gviz0",
            user: "root",
            password: "1234",
          });
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

export async function POST(req: NextRequest, res: NextResponse) {
    const body:any = await req.json();
    try{
        const ress = await query({query: body["query"].replace("\n", " ")});
        console.log("ress: ", ress);
        return NextResponse.json({data:ress});

    }catch(error:any){
        console.error("Error details:", error);
        return NextResponse.json({errorMsg:error?.sqlMessage, status: error?.sqlState}) ;
    }
}