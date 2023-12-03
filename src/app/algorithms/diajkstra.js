export function dijkstra(graph, startNodeId, endNodeId) {
  const distances = {};
  const visited = {};
  const parents = {};

  // Initialize distances with Infinity, except for the start node
  for (const node of graph.nodes) {
      distances[node.id] = Infinity;
  }
  distances[startNodeId] = 0;

  while (true) {
    let minDistance = Infinity;
    let currentNodeId = null;
      // Find the unvisited node with the smallest distance
      for (const nodeId in distances) {
          if (!visited[nodeId] && distances[nodeId] < minDistance) {
            minDistance = distances[nodeId];
            currentNodeId = nodeId;
          }
        }
        
      if (currentNodeId === null) {
          break; // All nodes have been visited
      }
      // Mark the current node as visited
      visited[currentNodeId] = true;
      // Update distances to neighbors
      for (const edge of graph.edges) {
        if (edge.from === currentNodeId) {
              const neighborNodeId = edge.to;
              const totalDistance = distances[currentNodeId] + 1; // Assuming all edges have equal weight

              if (!distances[neighborNodeId] || totalDistance < distances[neighborNodeId]) {
                  distances[neighborNodeId] = totalDistance;
                  parents[neighborNodeId] = currentNodeId;
              }
          }
      }
  }
  // Reconstruct the path from end node to start node
  const path = [];

  let currentNode = endNodeId;
  while (currentNode && currentNode !== startNodeId) {
      path.unshift(currentNode);
      currentNode = parents[currentNode];
  }
  path.unshift(startNodeId);

  return path;
}

// const EDGES = [
//   {
//       "from": "{\"fid\":1,\"name\":\"DB\"}",
//       "to": "{\"id\":1,\"name\":\"shams\"}",
//       "id": "17d2a178-4e68-4da4-80a1-93d5394389e5"
//   },
//   {
//       "from": "{\"fid\":2,\"name\":\"COAL\"}",
//       "to": "{\"id\":2,\"name\":\"sadiq\"}",
//       "id": "c87b7e31-dfc5-4104-a185-5b428c778e0c"
//   },
//   {
//       "from": "{\"fid\":3,\"name\":\"LA\"}",
//       "to": "{\"id\":3,\"name\":\"saed\"}",
//       "id": "af284f83-e585-44c6-bd35-d41d8dc55600"
//   },
//   {
//       "from": "{\"fid\":4,\"name\":\"DSA\"}",
//       "to": "{\"id\":4,\"name\":\"f\"}",
//       "id": "93b71daf-5ca3-4263-96d5-8bab9d192ab2"
//   },
//   {
//       "from": "{\"cname\":\"LA\",\"sid\":1}",
//       "to": "{\"id\":1,\"name\":\"faakhir\"}",
//       "id": "ea4100a8-0395-4244-ab5c-2fc03ba34ed7"
//   },
//   {
//       "from": "{\"cname\":\"LA\",\"sid\":1}",
//       "to": "{\"fid\":3,\"name\":\"LA\"}",
//       "id": "200e70fe-ae6b-4fa8-aa0c-0edc6ed647bc"
//   },
//   {
//       "from": "{\"cname\":\"DB\",\"sid\":1}",
//       "to": "{\"id\":1,\"name\":\"faakhir\"}",
//       "id": "272d3a73-1499-4292-8a5a-c24cb310c30b"
//   },
//   {
//       "from": "{\"cname\":\"DB\",\"sid\":1}",
//       "to": "{\"fid\":1,\"name\":\"DB\"}",
//       "id": "705020aa-2b1e-41c4-aa9b-6e8ce375ba5c"
//   },
//   {
//       "from": "{\"cname\":\"DSA\",\"sid\":1}",
//       "to": "{\"id\":1,\"name\":\"faakhir\"}",
//       "id": "e08b6723-b7f9-4f8b-9988-e0e015d47cdc"
//   },
//   {
//       "from": "{\"cname\":\"DSA\",\"sid\":1}",
//       "to": "{\"fid\":4,\"name\":\"DSA\"}",
//       "id": "bfe0ba40-fa1f-49de-8109-4e81a1c4ab0b"
//   },
//   {
//       "from": "{\"cname\":\"COAL\",\"sid\":1}",
//       "to": "{\"id\":1,\"name\":\"faakhir\"}",
//       "id": "b123b672-27a9-466a-8202-6b5811dbd9c5"
//   },
//   {
//       "from": "{\"cname\":\"COAL\",\"sid\":1}",
//       "to": "{\"fid\":2,\"name\":\"COAL\"}",
//       "id": "7de5b998-cd91-4b01-9dbc-79ca57f83c80"
//   }
// ]
// const NODES=[
//   {
//       "id": "{\"fid\":1,\"name\":\"DB\"}",
//       "label": "Class",
//       "title": "{\"name\":\"DB\",\"fid\":1}",
//       "color": "#d575e5"
//   },
//   {
//       "id": "{\"fid\":2,\"name\":\"COAL\"}",
//       "label": "Class",
//       "title": "{\"name\":\"COAL\",\"fid\":2}",
//       "color": "#d575e5"
//   },
//   {
//       "id": "{\"fid\":3,\"name\":\"LA\"}",
//       "label": "Class",
//       "title": "{\"name\":\"LA\",\"fid\":3}",
//       "color": "#d575e5"
//   },
//   {
//       "id": "{\"fid\":4,\"name\":\"DSA\"}",
//       "label": "Class",
//       "title": "{\"name\":\"DSA\",\"fid\":4}",
//       "color": "#d575e5"
//   },
//   {
//       "id": "{\"cname\":\"LA\",\"sid\":1}",
//       "label": "Enrolled",
//       "title": "{\"sid\":1,\"cname\":\"LA\"}",
//       "color": "#5e3e7a"
//   },
//   {
//       "id": "{\"cname\":\"DB\",\"sid\":1}",
//       "label": "Enrolled",
//       "title": "{\"sid\":1,\"cname\":\"DB\"}",
//       "color": "#5e3e7a"
//   },
//   {
//       "id": "{\"cname\":\"DSA\",\"sid\":1}",
//       "label": "Enrolled",
//       "title": "{\"sid\":1,\"cname\":\"DSA\"}",
//       "color": "#5e3e7a"
//   },
//   {
//       "id": "{\"cname\":\"COAL\",\"sid\":1}",
//       "label": "Enrolled",
//       "title": "{\"sid\":1,\"cname\":\"COAL\"}",
//       "color": "#5e3e7a"
//   },
//   {
//       "id": "{\"id\":1,\"name\":\"faakhir\"}",
//       "label": "Student",
//       "title": "{\"id\":1,\"name\":\"faakhir\"}",
//       "color": "#d4d4ed"
//   },
//   {
//       "id": "{\"id\":2,\"name\":\"moiz\"}",
//       "label": "Student",
//       "title": "{\"id\":2,\"name\":\"moiz\"}",
//       "color": "#d4d4ed"
//   },
//   {
//       "id": "{\"id\":3,\"name\":\"lemon\"}",
//       "label": "Student",
//       "title": "{\"id\":3,\"name\":\"lemon\"}",
//       "color": "#d4d4ed"
//   },
//   {
//       "id": "{\"id\":4,\"name\":\"mash\"}",
//       "label": "Student",
//       "title": "{\"id\":4,\"name\":\"mash\"}",
//       "color": "#d4d4ed"
//   },
//   {
//       "id": "{\"id\":1,\"name\":\"shams\"}",
//       "label": "Teacher",
//       "title": "{\"id\":1,\"name\":\"shams\"}",
//       "color": "#e4af45"
//   },
//   {
//       "id": "{\"id\":2,\"name\":\"sadiq\"}",
//       "label": "Teacher",
//       "title": "{\"id\":2,\"name\":\"sadiq\"}",
//       "color": "#e4af45"
//   },
//   {
//       "id": "{\"id\":3,\"name\":\"saed\"}",
//       "label": "Teacher",
//       "title": "{\"id\":3,\"name\":\"saed\"}",
//       "color": "#e4af45"
//   },
//   {
//       "id": "{\"id\":4,\"name\":\"f\"}",
//       "label": "Teacher",
//       "title": "{\"id\":4,\"name\":\"f\"}",
//       "color": "#e4af45"
//   }
// ]
// let edges = EDGES.map((edge) => {
//   return {
//       from: edge.from,
//       to: edge.to
//   }
// });
// edges=edges.concat(edges.map((edge) => {
//   return {
//       from: edge.to,
//       to: edge.from
//   }
// }));
// // Example usage
// const b={id: '{"id":2,"name":"sadiq"}'}
// const a={id:'{"id":1,"name":"faakhir"}'}
// const startNode = a.id;
// const endNode = b.id;
// const shortestPath = dijkstra({ nodes:NODES, edges }, startNode, endNode);

// console.log("Shortest Path:", shortestPath);