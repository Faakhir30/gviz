"use client";
import React, { useEffect, useState } from "react";
import TsGraph from "./(_components_)/tsgraph";

export default function Home() {
  const [curOutput, setCurOutput] = useState('');
  const [curNodes, setCurNodes] = useState<any[]>([]);
  const [curEdges, setCurEdges] = useState<any[]>([]);
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
  console.log(curEdges, curNodes);
  return (
    <main className="bg-primary-medium-dark">
      <div className="flex w-full h-screen p-0 justify-center">
        <div className="w-70">
          <div className=" h-20">input section</div>

          <div className="bg-primary-dark" style={{ height: "85vh" }}>
            <TsGraph setCurOutput={setCurOutput} nodes={curNodes} edges={curEdges} />
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
