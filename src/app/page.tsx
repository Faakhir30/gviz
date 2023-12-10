"use client";
import React, { useCallback, useEffect, useState } from "react";
import TsGraph from "./(_components_)/tsgraph";
import { dijkstra } from "./algorithms/diajkstra";
import { delay } from "./utills/delay";
import CodeEditor from "./(_components_)/codeEditor";
import { Node, Edge } from "react-vis-graph-wrapper";
import Table from "./(_components_)/table";
export default function Home() {
  const [curOutput, setCurOutput] = useState("");
  const [curNodes, setCurNodes] = useState<Node[]>([]);
  const [data, setData] = useState<any>();
  const [curEdges, setCurEdges] = useState<Edge[]>([]);
  const [defaultNodes, setDefaultNodes] = useState<any[]>([]);
  const [defaultEdges, setDefaultEdges] = useState<any[]>([]);
  const [sideView, setSideView] = useState(false);
  const showSideView = () => {
    setSideView(!sideView);
  };

  const [start, setStart] = useState<any>({ id: '{"id":1,"name":"faakhir"}' });
  const [end, setEnd] = useState<any>({ id: '{"id":2,"name":"sadiq"}' });
  async function apicalls() {
    const data = await (
      await fetch("http://localhost:3000/api/getData")
    ).json();
    setData(data.data);
    setCurNodes(data.nodes);
    setCurEdges(data.edges);
    console.log(data.data);
    setDefaultNodes(data.nodes);
    setDefaultEdges(data.edges);
  }
  useEffect(() => {
    apicalls();
  }, []);

  const visualizeDijkstra = useCallback(async () => {
    let nodes = [start];
    let visited: any[] = [start.id];
    setCurNodes(
      curNodes.map((node) =>
        node.id === start.id ? { ...node, color: "#fff" } : node
      )
    );
    while (nodes.length > 0) {
      const node = nodes.shift();
      const edges = curEdges.filter(
        (e) => e.from === node.id && !visited.includes(e.to)
      );
      for await (const edge of edges) {
        const toNode = curNodes.find((n) => n.id === edge.to);
        if (!toNode) continue;
        setCurNodes(
          curNodes.map((n) => (n.id === toNode.id ? { ...n, color: "red" } : n))
        );
        setCurEdges(
          curEdges.map((e) =>
            (e.to === edge.to && e.from === edge.from) ||
            (e.to === edge.from && e.from === edge.to)
              ? { ...e, color: "red" }
              : e
          )
        );
        visited.push(toNode.id);
        await delay(1000);
        if (toNode.id === end.id) {
          setCurNodes(
            curNodes.map((n) =>
              n.id === toNode.id ? { ...n, color: "green" } : n
            )
          );
          await delay(300);
          setCurNodes(
            curNodes.map((n) =>
              n.id === toNode.id ? { ...n, color: "#fff" } : n
            )
          );
          await delay(300);
          setCurNodes(
            curNodes.map((n) =>
              n.id === toNode.id ? { ...n, color: "green" } : n
            )
          );
          await delay(300);
          return visualizeCorrectDijkstraPath(defaultNodes);
        }
        nodes.push(toNode);
      }
      console.log("nodes", nodes);
    }
  }, [curEdges, curNodes]);
  const visualizeCorrectDijkstraPath = async (initialNodes: any) => {
    const path = dijkstra(
      { nodes: curNodes, edges: curEdges },
      '{"id":1,"name":"faakhir"}',
      '{"id":2,"name":"sadiq"}'
    );
    let i = 0;
    for await (const node_id of path) {
      setCurNodes(
        curNodes.map((n) => (n?.id === node_id ? { ...n, color: "green" } : n))
      );
      setCurEdges(
        curEdges.map((e) =>
          i > 0 &&
          ((e.to === node_id && e.from === path[i - 1]) ||
            (e.to === path[i - 1] && e.from === node_id))
            ? { ...e, color: "green" }
            : e
        )
      );
      await delay(700);
      i++;
    }
    setCurNodes(initialNodes);
    setCurEdges(defaultEdges);
  };
  return (
    <main className="bg-primary-medium-dark">
      <div className="flex w-full h-screen p-0 ">
        <div className={`w-70 ${sideView && "opacity-50"}`}>
          <div className="h-20 overflow-y-hidden">
            <CodeEditor />
          </div>

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
          <>
            <div className="h-screen">
              <div className="h-1/6">
                <button onClick={showSideView}>Select Nodes</button>
              </div>
              <div className="h-auto">{curOutput}</div>
            </div>
            <button onClick={showSideView}>Select Nodes</button>
            {sideView && data && (
              <div className="absolute top-0 right-0 h-screen w-[70vw] animate-progressBar bg-primary-medium-dark">
                {Object.keys(data).map((table) => {
                 return <div key={table}>
                    <Table
                      headers={Object.keys(data[table][0])}
                      data={data[table].map((row: any) => Object.values(row))}
                      displayCheckboxes={false}
                      className=" w-5/6 text-left text-sm"
                    />
                  </div>;
                })}
              </div>
            )}
          </>
        </div>
      </div>
    </main>
  );
}
