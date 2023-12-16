"use client";
import React, { useCallback, useEffect, useState } from "react";
import TsGraph from "./(_components_)/tsgraph";
import { dijkstra } from "./algorithms/diajkstra";
import { delay } from "./utills/delay";
import CodeEditor from "./(_components_)/codeEditor";
import { Node, Edge } from "react-vis-graph-wrapper";
import Table from "./(_components_)/table";
import toast, { Toaster } from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { SiGraphql } from "react-icons/si";

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
  const [start, setStart] = useState<any>();
  const [end, setEnd] = useState<any>();
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
  const clearColors = useCallback(async () => {
    setCurNodes(
      curNodes.map((n) =>
        n.color === "#fff" || n.color === "#444"
          ? { ...n, color: n.color }
          : { ...n, color: "#aaa" }
      )
    );
    setCurEdges(
      curEdges.map((e) => {
        return { ...e, color: "#aaa" };
      })
    );
  }, [curEdges, curNodes]);

  const visualizeDijkstra = useCallback(async () => {
    await clearColors();
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
          setCurNodes(
            curNodes.map((n) =>
              n.id === toNode.id ? { ...n, color: "#fff" } : n
            )
          );
          await delay(300);
          return visualizeCorrectDijkstraPath(curNodes);
        }
        nodes.push(toNode);
      }
    }
    toast.error("No path Found");
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
    try {
      const res = await fetch("http://localhost:3000/api/runQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryy }),
      });
      const p = await res.json();
      if (p.errorMsg) {
        toast.error(p.errorMsg);
        return;
      }
      await apicalls();
    } catch (e) {
      console.log(e);
      console.log("msg", e as any);
    }
  };
  return (
    <main className="bg-primary-medium-light">
      <div className="flex flex-col w-full h-screen p-0 ">
        <Toaster />
        <nav className="border-b-2 border-slate-600 bg-primary-light flex h-fit justify-between items-center">
          <div className="flex text-3xl justify-center font-extrabold text-slate-600 items-center">
            <SiGraphql className="m-2" />
            <h1>SLQViz</h1>
          </div>
          <button
            className="rounded-lg bg-slate-600 p-2 border-2 m-4"
            onClick={showEnd}
          >
            Select End
          </button>
          <button
            className="rounded-lg bg-slate-600 p-2 border-2 m-4"
            onClick={showStart}
          >
            Select Start
          </button>
          <button
            className="rounded-lg bg-slate-600 p-2 border-2 m-4"
            onClick={visualizeDijkstra}
          >
            Visualize
          </button>
        </nav>
        <div className="">
          {sideView && data && (
            <div className="absolute text-3xl text-primary-dark rounded-xl mt-4 max-h-[80vh] overflow-auto left-[20%] w-[60vw] bg-primary-light z-10">
              <button className="text-5xl" onClick={() => setSideView(false)}>
                <IoIosClose />
              </button>
              <h1 className="font-extrabold text-center">TABLES</h1>
              {Object.keys(data).map((table) => {
                if (data[table].length > 0)
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
        </div>
        <div className={`grid h-full grid-cols-4 ${sideView && "opacity-50"}`}>
          <div className="col-span-3">
            <TsGraph
              setCurOutput={setCurOutput}
              nodes={curNodes}
              edges={curEdges}
            />
          </div>
          <div className="col-span-1 border-l-2 border-slate-600">
            <CodeEditor value={queryy} onChange={setQuery} />
            <button
              className="absolute right-0 bottom-0 rounded-lg bg-slate-600 p-2 border-2 m-4"
              onClick={runQuery}
            >
              Run Query
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
