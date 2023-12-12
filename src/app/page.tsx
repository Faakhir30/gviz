"use client";
import React, { useCallback, useEffect, useState } from "react";
import TsGraph from "./(_components_)/tsgraph";
import { dijkstra } from "./algorithms/diajkstra";
import { delay } from "./utills/delay";
import CodeEditor from "./(_components_)/codeEditor";
import { Node, Edge } from "react-vis-graph-wrapper";
import Table from "./(_components_)/table";
import { IoIosClose } from "react-icons/io";
import { query } from "./lib/db";
export default function Home() {
  const [curOutput, setCurOutput] = useState("");
  const [curNodes, setCurNodes] = useState<Node[]>([]);
  const [data, setData] = useState<any>();
  const [curEdges, setCurEdges] = useState<Edge[]>([]);
  const [defaultNodes, setDefaultNodes] = useState<any[]>([]);
  const [defaultEdges, setDefaultEdges] = useState<any[]>([]);
  const [sideView, setSideView] = useState(false);
  const [state, setState] = useState(1);
  const [queryy, setQuery] = useState("");
  const showStart = () => {
    setState(0);
    setSideView(!sideView);
  };
  const showEnd = () => {
    setState(1);
    setSideView(!sideView);
  };
  const [start, setStart] = useState<any>('{"id":1,"name":"faakhir"}');
  const [end, setEnd] = useState<any>('{"id":2,"name":"sadiq"}');
  async function apicalls() {
    const data = await (
      await fetch("http://localhost:3000/api/getData")
    ).json();
    setData(data.data);
    setCurNodes(data.nodes);
    setCurEdges(data.edges);
    setDefaultNodes(data.nodes);
    setDefaultEdges(data.edges);
  }
  useEffect(() => {
    apicalls();
  }, []);
  useEffect(() => {
    curNodes.find((n) => n.id === start) &&
      setCurNodes(
        curNodes.map((n) =>
          n.id === start
            ? { ...n, color: "#fff" }
            : { ...n, color: n.color === "#444" ? "#444" : "#aaa" }
        )
      );
  }, [start]);
  useEffect(() => {
    curNodes.find((n) => n.id === end) &&
      setCurNodes(
        curNodes.map((n) =>
          n.id === end
            ? { ...n, color: "#444" }
            : { ...n, color: n.color === "#fff" ? "#fff" : "#aaa" }
        )
      );
  }, [end]);
  const visualizeDijkstra = useCallback(async () => {
    const firstNode = curNodes.find((n) => n.id === start);
    if (!firstNode) {
      alert("start node not found");
      return;
    }
    setCurEdges(
      curEdges.map((e) => {
        return { ...e, color: "#aaa" };
      })
    );
    let nodes = [firstNode];
    let visited: any[] = [start];
    setCurNodes(
      curNodes.map((node) =>
        node.id === start.id ? { ...node, color: "#fff" } : node
      )
    );
    while (nodes.length > 0) {
      const node = nodes.shift();
      const edges = curEdges.filter(
        (e) => e.from === node?.id && !visited.includes(e.to)
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
        if (toNode.id === end) {
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
    }
  }, [curEdges, curNodes, end, start]);
  const visualizeCorrectDijkstraPath = async (initialNodes: any) => {
    const path = dijkstra({ nodes: curNodes, edges: curEdges }, start, end);
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
  const runQuery = async () => {
    try{
    const res = await fetch("http://localhost:3000/api/runQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({query:queryy}),
    });
    const p=await res.json()
    console.log(p)
    await apicalls();
    }catch(e){
      console.log(e)
    }
  };
  return (
    <main className="bg-primary-medium-dark">
      <div className="flex w-full h-screen p-0 ">
        <div className={`w-70 ${sideView && "opacity-50"}`}>
          <div className="h-20 overflow-y-hidden">
            <CodeEditor 
              value={queryy}
              onChange={(val:any) => setQuery(val)}
            />
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
                <button className="p-2 bg-grey border-2 m-4" onClick={runQuery}>Run Query</button>
                <button className="p-2 bg-grey border-2 m-4" onClick={showEnd}>Select End</button>
                <button className="p-2 bg-grey border-2 m-4" onClick={showStart}>Select Start</button>
              </div>
            </div>
            {sideView && data && (
              <div className="absolute max-h-screen overflow-auto top-0 right-0 h-screen w-[70vw] animate-progressBar bg-primary-medium-dark">
                <button
                  className=" text-5xl"
                  onClick={() => setSideView(false)}
                >
                  <IoIosClose />
                </button>
                <h1 className="font-extrabold text-center">TABLES</h1>
                {Object.keys(data).map((table) => {
                  return (
                    <div key={table}>
                      <Table
                        title={table}
                        start={start}
                        end={end}
                        setEnd={setEnd}
                        setStart={setStart}
                        state={state}
                        headers={Object.keys(data[table][0])}
                        data={data[table].map((row: any) => Object.values(row))}
                        displayCheckboxes={false}
                        className=" w-5/6 text-left text-sm"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        </div>
      </div>
    </main>
  );
}
