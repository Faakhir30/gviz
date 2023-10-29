import { query } from "@/app/lib/db";
import { generateColors } from "@/app/utills/colors";
import { NextResponse } from "next/server";
import crypto from "crypto";
export async function GET(req: Request, res: NextResponse) {
  const tables: any = await query({ query: "show tables" });
  let tableNames = [];
  if (tables) {
    tableNames = tables.map((table: any) => Object.values(table)[0]);
  }
  let nodesData: any = {};
  for (const tableName of tableNames) {
    nodesData = {
      ...nodesData,
      [tableName]: await query({
        query: `select * from ${tableName} limit 10`,
      }),
    };
  }
  let nodes: any = [];
  for (const tableName of Object.keys(nodesData)) {
    nodesData[tableName].map((node: any) => {
      nodes.push({
        id: JSON.stringify(node, Object.keys(node).sort()),
        label:tableName,
          // (Object.values(node)[1] + "").length > 9
          //   ? (Object.values(node)[1] + "").substring(0, 7) + "..."
          //   : Object.values(node)[1],
        title: JSON.stringify(node),
        color: generateColors(tableName),
      });
      
    });
  }

  const edgesData: any = await query({
    query: `SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = 'gviz0'  AND REFERENCED_TABLE_NAME IS NOT NULL;`,
  });
  let edges: any = [];

  // Define a helper function to get edges for a specific node
  async function getEdgesForNode(tableName: string, node: any) {
    const possibleEdges = edgesData.filter((edge: any) => edge.TABLE_NAME == tableName);
    let data:any=[]
    for(const edge of possibleEdges){
      const d:any=await query({
        query: `select * from ${edge.REFERENCED_TABLE_NAME} where ${edge.REFERENCED_COLUMN_NAME}='${node[edge.COLUMN_NAME]}'`,
      });
      if (Array.isArray(d)) {
        data = data.concat(d);
      } else if (typeof d === 'object') {
        data.push(d);
      }    }
    for(const d of data){
      edges.push({
        from: JSON.stringify(node, Object.keys(node).sort()),
        to: JSON.stringify(d, Object.keys(d).sort()),
      });
    }
  }

  // Use Promise.all to await all the getEdgesForNode calls
  const promises = Object.keys(nodesData).map(async (tableName) => {
    for (const node of nodesData[tableName]) {
      if (edgesData.some((edge:any) => edge.TABLE_NAME === tableName)) {
        await getEdgesForNode(tableName, node);
      }
    }
  });

  // Wait for all promises to complete
  await Promise.all(promises);

  let graphData = {
    nodes,
    edges: edges,
  };

  return NextResponse.json(graphData);
}