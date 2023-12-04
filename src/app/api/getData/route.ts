import { query } from "@/app/lib/db";
import { generateColors } from "@/app/utills/colors";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextResponse) {
  const tables: any = await query({ query: "show tables" });
  let tableNames = [];
  if (tables) {
    tableNames = tables.map((table: any) => Object.values(table)[0]);
  }

  // Build a mapping of table names to their data
  let nodesData: any = {};
  for (const tableName of tableNames) {
    nodesData[tableName] = await query({
      query: `select * from ${tableName}`,
    });
  }

  let nodes: any = [];
  let assignedColrs: any = {};
  for (const tableName of Object.keys(nodesData)) {
    nodesData[tableName].map((node: any) => {
      nodes.push({
        id: JSON.stringify(node, Object.keys(node).sort()),
        label: tableName,
        title: JSON.stringify(node),
        color: '#aaa',
      });
    });
  }

  const edgesData: any = await query({
    query: `SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = 'gviz0' AND REFERENCED_TABLE_NAME IS NOT NULL;`,
  });

  let edges: any = [];

  // Define a helper function to get edges for a specific node
  function getEdgesForNode(tableName: string, node: any) {
    edgesData.forEach((edge: any) => {
      if (edge.TABLE_NAME === tableName) {
        const referencedTableName = edge.REFERENCED_TABLE_NAME;
        const referencedColumnName = edge.REFERENCED_COLUMN_NAME;
        const referencedValue = node[edge.COLUMN_NAME];

        // Find matching nodes in the referenced table
        if (nodesData[referencedTableName]) {
          const matchingNodes = nodesData[referencedTableName].filter(
            (referencedNode: any) => {
              return referencedNode[referencedColumnName] === referencedValue;
            }
          );

          // Create edges from matching nodes
          edges = edges.concat(
            matchingNodes.map((matchingNode: any) => ({
              from: JSON.stringify(node, Object.keys(node).sort()),
              to: JSON.stringify(
                matchingNode,
                Object.keys(matchingNode).sort()
              ),
            }))
          );
        }
      }
    });
  }

  // Use Promise.all to await all the getEdgesForNode calls
  const promises = Object.keys(nodesData).map(async (tableName) => {
    for (const node of nodesData[tableName]) {
      getEdgesForNode(tableName, node);
    }
  });

  // Wait for all promises to complete
  await Promise.all(promises);

  // Add reverse edges
  edges.map((edge:any) => {
    return {
        from: edge.from,
        to: edge.to
    }
  });
  edges=edges.concat(edges.map((edge:any) => {
    return {
        from: edge.to,
        to: edge.from
    }
  }));
  let graphData = {
    nodes,
    edges: edges,
  };

  return NextResponse.json(graphData);
}
