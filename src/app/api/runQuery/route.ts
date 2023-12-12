import { query } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body:any = await req.json();
    try{
        const ress = await query({query: body["query"]});
        console.log("ress: ", ress);
        return NextResponse.json(ress);

    }catch(error){
        console.error("Error executing query:", body["query"]);
        console.error("Error details:", error);
        throw error;
    }
}