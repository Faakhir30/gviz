import { EdgeColor, NodeColor } from "@/app/utills/constants";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextResponse) {
  const tablesQ:any=await fetch("http://localhost:3000/api/runQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "show tables" }),
      }).then((res) => res.json())
      .catch((err) => console.log(JSON.stringify(err)))
      ;
  const tables = tablesQ.data
  let tableNames = [];
  if (tables) {
    tableNames = tables.map((table: any) => Object.values(table)[0]);
  }

  // Build a mapping of table names to their data
  let nodesData: any = {};
  for await (const tableName of tableNames) {
     const d= await fetch("http://localhost:3000/api/runQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `select * from ${tableName}`,
          }),
      }).then((res) => res.json())
      .catch((err) => console.log(JSON.stringify(err)))

      nodesData[tableName]=d.data;
  }

  let nodes: any = [];
 for (const tableName of Object.keys(nodesData)) {
    nodesData[tableName].map((node: any) => {
      nodes.push({
        id: JSON.stringify(node, Object.keys(node).sort()),
        label: tableName,
        title: JSON.stringify(node),
        color: NodeColor,
      });
    });
  }
  const edgesDataQ = await fetch("http://localhost:3000/api/runQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: `SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = 'gviz0' AND REFERENCED_TABLE_NAME IS NOT NULL;`,

         }),
      }).then((res) => res.json())
      .catch((err) => console.log(JSON.stringify(err)))

  const edgesData = edgesDataQ.data
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
              color: EdgeColor,
              width: 2,

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
  const undirectedEdges = JSON.parse(JSON.stringify(edges))
  // Add reverse edges
  edges=edges.concat(edges.map((edge:any) => {
    return {
        from: edge.to,
        to: edge.from,
        color: EdgeColor,
        width: 2,

    }
  }));
  let graphData = {
    nodes,
    edges: edges,
    data:nodesData,
    undirectedEdges
  };
  return NextResponse.json(graphData);
}
