"use client";
import React, { useEffect, useState } from "react";
import TsGraph from "./(_components_)/tsgraph";
import { dijkstra } from "./algorithms/diajkstra";
import { delay } from "./utills/delay";
export default function Home() {
  const [curOutput, setCurOutput] = useState("");
  const [curNodes, setCurNodes] = useState<any[]>([]);
  const [curEdges, setCurEdges] = useState<any[]>([]);
  const [speed, setSpeed] = useState(100);
  const [algo, setAlgo] = useState("dijkstra");
  const [start, setStart] = useState<any>({ id: '{"id":1,"name":"faakhir"}' });
  const [end, setEnd] = useState<any>({ id: '{"id":2,"name":"sadiq"}' });
  async function apicalls() {
    const data = await (
      await fetch("http://localhost:3000/api/getData")
    ).json();
    setCurNodes(data.nodes);
    setCurEdges(data.edges);
  }
  useEffect(() => {
    apicalls();
  }, []);

  const visualizeDijkstra = async() => {
    let nodes = [start];
    let visited:any[] = [start.id];
    while (nodes.length > 0) {
      const node = nodes.shift();
      console.log("node", node);
      const edges = curEdges.filter(
        (e) => e.from === node.id && !(visited.includes(e.to))
      );
      console.log("edges", edges);
      for await (const edge of edges){
        const toNode = curNodes.find((n) => n.id === edge.to);
        if (!toNode) continue;
        setCurNodes(
          curNodes.map((n) => (n.id === toNode.id ? { ...n, color: "red" } : n))
        );
        visited.push(toNode.id);
        await delay(1000);
        console.log("updating color");
        if (toNode.id === end.id) {
          console.log("reutrning");
          return visualizeCorrectDijkstraPath();
        }
        nodes.push(toNode);
      }
      
      console.log("nodes", nodes);
    }
  };
  const visualizeCorrectDijkstraPath = async() => {
    const path = dijkstra(
      { nodes: curNodes, edges: curEdges },
      '{"id":1,"name":"faakhir"}',
      '{"id":2,"name":"sadiq"}'
    );
    console.log("path", path);
    for (const node_id of path) {
      const newNodes =curNodes.map((n) => (n?.id === node_id ? { ...n, color: "green" } : n))
      // console.log(newNodes.)
      setCurNodes(
        newNodes
      );
      await delay(1000);
    }
  };
  return (
    <main className="bg-primary-medium-dark">
      <div className="flex w-full h-screen p-0 justify-center">
        <div className="w-70">
          <div className=" h-20">input section</div>

          <div className="bg-primary-dark" style={{ height: "85vh" }}>
            <button onClick={visualizeDijkstra}>Visualize Dijkstra</button>
            <TsGraph
              setCurOutput={setCurOutput}
              nodes={curNodes}
              edges={curEdges}
            />
          </div>
        </div>
        <div className="w-60">
          OUtput
          {curOutput}
        </div>
      </div>
    </main>
  );
}
