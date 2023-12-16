"use client";
import React, { useCallback, useEffect, useState } from "react";
import TsGraph from "../(_components_)/tsgraph";
import { dijkstra } from "../algorithms/diajkstra";
import { delay } from "../utills/delay";
import CodeEditor from "../(_components_)/codeEditor";
import { Node, Edge } from "react-vis-graph-wrapper";
import Table from "../(_components_)/table";
import toast from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { SiGraphql } from "react-icons/si";
import { EdgeColor, EndColor, NodeColor, SelectColor, StartColor } from "../utills/constants";

export default function Home() {
  const [curOutput, setCurOutput] = useState("");
  const [curNodes, setCurNodes] = useState<Node[]>([]);
  const [data, setData] = useState<any>();
  const [curEdges, setCurEdges] = useState<Edge[]>([]);
  const [defaultNodes, setDefaultNodes] = useState<any[]>([]);
  const [defaultEdges, setDefaultEdges] = useState<any[]>([]);
  const [otherEdges, setOtherEdges] = useState<Edge[]>([]);
  const [sideView, setSideView] = useState(false);
  const [state, setState] = useState(1);
  const [queryy, setQuery] = useState("");
  const [isDirected, setIsDirected] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const changeDirected = useCallback(async () => {
    await clearColors();
    const edges = curEdges;
    setCurEdges(otherEdges);
    setOtherEdges(edges);
  }, [curEdges]);
  useEffect(() => {
    async function change() {
      await changeDirected();
    }
    change();
  }, [isDirected]);
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
      await fetch("/api/getData")
    ).json();
    setData(data.data);
    setCurNodes(data.nodes);
    setCurEdges(data.edges);
    setOtherEdges(data.undirectedEdges);
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
            ? { ...n, color: StartColor }
            : { ...n, color: n.color === StartColor ? NodeColor : n.color }
        )
      );
  }, [start]);
  useEffect(() => {
    curNodes.find((n) => n.id === end) &&
      setCurNodes(
        curNodes.map((n) =>
          n.id === end
            ? { ...n, color: EndColor }
            : { ...n, color: n.color === EndColor ? NodeColor : n.color }
        )
      );
  }, [end]);
  const clearColors = useCallback(async () => {
    setCurNodes(
      curNodes.map((n) =>
        n.color === StartColor || n.color === EndColor
          ? { ...n, color: n.color }
          : { ...n, color: NodeColor }
      )
    );
    setCurEdges(
      curEdges.map((e) => {
        return { ...e, color: EdgeColor };
      })
    );
    setCorrectCount(0);
    setVisitedCount(0);
  }, [curEdges, curNodes]);

  const visualizeDijkstra = useCallback(async () => {
    await clearColors();
    const firstNode = curNodes.find((n) => n.id === start);
    if (!firstNode) {
      toast.error("start node not found");
      return;
    }
    if (!end) {
      toast.error("end node not found");
      return;
    }
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
        setVisitedCount((prev) => prev + 1);
        setCurEdges((edges) =>
          edges.map((e) =>
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
      setCorrectCount((prev) => prev + 1);
      setCurEdges((edges) =>
        edges.map((e) =>
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
    // setCurEdges(defaultEdges);
  };
  const runQuery = async () => {
    try {
      const res = await fetch("/api/runQuery", {
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
      if (queryy.trim().toLowerCase().startsWith("select")) {
        if (p.data.length === 0) {
          toast.error("No data found");
          return;
        } else {
          const selectedIds = p.data?.map((d: any) =>
            JSON.stringify(d, Object.keys(d).sort())
          );
          setCurNodes((nodes) =>
            nodes.map((n) => ({
              ...n,
              color: selectedIds?.includes(n.id) ? SelectColor : NodeColor,
            }))
          );
        }
        toast.success("Query Executed");
        return;
      }
      await apicalls();
    } catch (e) {
      console.log(e);
      console.log("msg", e as any);
    }
  };
  return (
      <div className="flex flex-col w-full h-screen p-0 ">
        <nav className="border-b-2 border-slate-600 bg-primary-light flex h-fit justify-between items-center">
          <div className="flex text-3xl justify-center font-extrabold text-slate-600 items-center">
            <SiGraphql className="m-2" />
            <h1>SLQViz</h1>
          </div>
          <button
            className="rounded-lg bg-slate-600 p-2 border-2 m-4"
            onClick={clearColors}
          >
            Reset
          </button>
          <button
            className="rounded-lg bg-slate-600 p-2 border-2 m-4"
            onClick={showStart}
          >
            Select Start
          </button>
          <button
            className="rounded-lg bg-slate-600 p-2 border-2 m-4"
            onClick={showEnd}
          >
            Select End
          </button>
          <div
            onClick={() => setIsDirected(!isDirected)}
            className="cursor-pointer flex bg-slate-600 p-2 m-4 border-2 rounded-lg"
          >
            <h4>Directed</h4>
            <input type="checkbox" className="mx-2" checked={isDirected} />
          </div>
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
          <div className="relative col-span-3">
            <TsGraph
              setCurOutput={setCurOutput}
              nodes={curNodes}
              edges={curEdges}
            />
            <div className="absolute top-2 left-2 text-primary-dark">
              <h3>Nodes Visited: {visitedCount}</h3>
              <h3>Correct Path Length: {correctCount}</h3>
            </div>
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
  );
}
