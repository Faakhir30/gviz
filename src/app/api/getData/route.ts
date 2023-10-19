import { query } from "@/app/lib/db";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextResponse) {
  const data = await query({ query: "show tables" });
  return NextResponse.json(data);
}
