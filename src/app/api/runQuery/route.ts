import { query } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    const body:any = await req.json();
    try{
        const ress = await query({query: body["query"]});
        console.log("ress: ", ress);
        return NextResponse.json(ress);

    }catch(error:any){
        console.error("Error details:", error);
        return NextResponse.json({errorMsg:error?.sqlMessage, status: error?.sqlState}) ;
    }
}